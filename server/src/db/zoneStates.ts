/*
Copyright (c) Bryan Hughes <bryan@nebri.us>

This file is part of Home Lights.

Home Lights is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Home Lights is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Home Lights.  If not, see <http://www.gnu.org/licenses/>.
*/

import { DateTime } from 'luxon';
import { setSceneBrightness, getScenes } from './scenes';
import { getSchedules } from './schedule';
import { getZones } from './zones';
import { updateClients } from '../clients';
import { ActionType } from '../common/actions';
import { SCHEDULE_SCENE_ID } from '../common/config';
import {
  RawZoneState,
  Scene,
  Schedule,
  ScheduleEntry,
  Zone,
  ZoneState
} from '../common/types';
import { getItem, hasItem } from '../common/util';
import { dbAll, dbRun } from '../sqlite';
import { ActionHandler } from '../types';

const ZONE_STATES_TABLE = 'system_state';

const zoneStates: ZoneState[] = [];

export default function updateCache() {
  const results = dbAll<RawZoneState>(`SELECT * FROM ${ZONE_STATES_TABLE}`);

  // Add any entries that are missing, and update ones that exist
  for (const zone of results) {
    let zoneState = zoneStates.find(
      (zoneState) => zoneState.zoneId === zone.zone_id
    );

    // Add it if it doesn't exist, else update it
    if (!zoneState) {
      zoneState = {
        zoneId: zone.zone_id,
        currentSceneId: zone.current_scene_id,
        currentScheduleSceneId: undefined,
        power: !!zone.power
      };
      zoneStates.push(zoneState);
    } else {
      zoneState.zoneId = zone.zone_id;
      zoneState.currentSceneId = zone.current_scene_id;
      zoneState.power = !!zone.power;
    }

    // Set the current schedule scene ID
    if (zoneState.currentSceneId === SCHEDULE_SCENE_ID) {
      const schedule = getItem(zoneState.zoneId, getSchedules(), 'zoneId');
      zoneState.currentScheduleSceneId =
        getCurrentScheduleState(schedule).currentScheduleEntry.sceneId;
    } else {
      zoneState.currentScheduleSceneId = undefined;
    }
  }

  // Delete any zone states for zones that no longer exist
  for (let i = zoneStates.length - 1; i >= 0; i--) {
    if (!results.find((row) => row.zone_id === zoneStates[i].zoneId)) {
      zoneStates.splice(i, 1);
    }
  }
}

export function getZoneStates(): ZoneState[] {
  return zoneStates;
}

export function reconcile(zones: Zone[], scenes: Scene[]) {
  // Add any new zones to state that were created
  for (const zone of zones) {
    if (!zoneStates.find((zoneState) => zoneState.zoneId === zone.id)) {
      dbRun(
        `INSERT INTO ${ZONE_STATES_TABLE} (zone_id, power, current_scene_id) VALUES (?, ?, ?)`,
        [zone.id, 0, undefined]
      );
      zoneStates.push({
        zoneId: zone.id,
        currentSceneId: undefined,
        currentScheduleSceneId: undefined,
        power: false
      });
    }
  }

  // Remove any zones from zone state that were deleted
  for (let i = zoneStates.length - 1; i >= 0; i--) {
    const zoneState = zoneStates[i];
    if (!zones.find((zone) => zone.id === zoneState.zoneId)) {
      dbRun(`DELETE FROM ${ZONE_STATES_TABLE} WHERE zone_id = ?`, [
        zoneState.zoneId
      ]);
      zoneStates.splice(i, 1);
    }
  }

  // Update any patterns currently being displayed
  for (const zoneState of zoneStates) {
    if (zoneState.currentSceneId === SCHEDULE_SCENE_ID) {
      const schedule = getItem(zoneState.zoneId, getSchedules(), 'zoneId');
      enableZoneSchedule(schedule);
    } else {
      // Check if the scene was deleted
      if (
        zoneState.currentSceneId !== undefined &&
        !hasItem(zoneState.currentSceneId, scenes)
      ) {
        zoneState.currentSceneId = undefined;
      }
      setZoneState(zoneState);
    }
  }
}

export const setZoneScene: ActionHandler<ActionType.SetZoneScene> = async (
  request
) => {
  const scene = getItem(request.sceneId, getScenes());
  const zoneState = getItem(scene.zoneId, getZoneStates(), 'zoneId');
  zoneState.currentSceneId = request.sceneId;
  zoneState.power = true;
  setZoneState(zoneState);
};

export const enableZoneSchedule: ActionHandler<
  ActionType.EnableSchedule
> = async (request) => {
  // Bail early if the schedule is already running or there is no schedule set
  if (zoneTimeouts.has(request.zoneId) || request.entries.length === 0) {
    return;
  }
  const zoneState = getItem(request.zoneId, getZoneStates(), 'zoneId');
  zoneState.currentSceneId = SCHEDULE_SCENE_ID;
  zoneState.power = true;
  setZoneState(zoneState);
  scheduleTick(request);
};

export const setZoneBrightness: ActionHandler<
  ActionType.SetZoneBrightness
> = async (request) => {
  const zoneState = getItem(request.zoneId, getZoneStates(), 'zoneId');
  if (zoneState.currentSceneId === undefined) {
    return;
  }
  setSceneBrightness(zoneState.currentSceneId, request.brightness);
};

export const setZonePower: ActionHandler<ActionType.SetZonePower> = async (
  request
) => {
  const zoneState = getItem(request.zoneId, getZoneStates(), 'zoneId');
  zoneState.power = request.power;
  setZoneState(zoneState);
};

function setZoneState(zoneState: ZoneState) {
  dbRun(
    `REPLACE INTO ${ZONE_STATES_TABLE} (zone_id, power, current_scene_id) VALUES (?, ?, ?)`,
    [zoneState.zoneId, zoneState.power ? 1 : 0, zoneState.currentSceneId]
  );
  updateCache();
}

function createDateTime(now: DateTime, scheduleEntry: ScheduleEntry) {
  return DateTime.local(
    now.year,
    now.month,
    now.day,
    scheduleEntry.hour,
    scheduleEntry.minute
  );
}

const zoneTimeouts = new Map<number, NodeJS.Timeout>();

function getCurrentScheduleState(schedule: Schedule) {
  const now = DateTime.local();
  let currentScheduleEntry: ScheduleEntry | undefined;
  let nextScheduleEntry: ScheduleEntry | undefined;

  // First, check if the time is before the first schedule of the day
  if (now < createDateTime(now, schedule.entries[0])) {
    currentScheduleEntry = schedule.entries[schedule.entries.length - 1];
    nextScheduleEntry = schedule.entries[0];
  } else {
    // Otherwise it's equal to or after the first entry, so search through and
    // find out which entry is currently active by finding where one entry is
    // equal to or after one entry, and before the next entry
    for (let i = 0; i < schedule.entries.length - 1; i++) {
      if (
        now >= createDateTime(now, schedule.entries[i]) &&
        now < createDateTime(now, schedule.entries[i + 1])
      ) {
        currentScheduleEntry = schedule.entries[i];
        nextScheduleEntry = schedule.entries[i + 1];
        break;
      }
    }

    // If we didn't find a schedule entry, that means it's the last entry of the day
    if (!currentScheduleEntry || !nextScheduleEntry) {
      currentScheduleEntry = schedule.entries[schedule.entries.length - 1];
      nextScheduleEntry = schedule.entries[0];
    }
  }

  // Calculate the time of the next transition
  let nextScheduleEntryStart = createDateTime(now, nextScheduleEntry);

  // Handle the case where the next event is the start of the schedule, which is
  // signified by being in the past
  if (nextScheduleEntryStart < now) {
    nextScheduleEntryStart = nextScheduleEntryStart.plus({ days: 1 });
  }

  // Add a 5 second delay just to make sure all the date math aligns correctly
  nextScheduleEntryStart = nextScheduleEntryStart.plus({ seconds: 5 });

  return {
    currentScheduleEntry,
    nextScheduleEntryStart
  };
}

function scheduleTick(schedule: Schedule) {
  const now = DateTime.local();
  const { currentScheduleEntry, nextScheduleEntryStart } =
    getCurrentScheduleState(schedule);

  // Schedule the next transition
  console.log(
    `Schedule next transition for ${nextScheduleEntryStart.toLocaleString(
      DateTime.DATETIME_FULL
    )}`
  );
  setTimeout(
    () => scheduleTick(schedule),
    nextScheduleEntryStart.valueOf() - now.valueOf()
  );

  // Update zone state
  const zoneState = getItem(schedule.zoneId, getZoneStates(), 'zoneId');
  zoneState.currentScheduleSceneId = currentScheduleEntry.sceneId;

  // Force a reconcile to update light state
  reconcile(getZones(), getScenes());

  // Notify all connected clients of the change
  updateClients();
}
