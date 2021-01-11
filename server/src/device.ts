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
import { ActionType } from './common/actions';
import { SCHEDULE_SCENE_ID } from './common/config';
import {
  Schedule,
  ScheduleEntry,
  SystemState,
  Zone,
  ZoneState
} from './common/types';
import { getItem } from './common/util';
import { getLights } from './db/lights';
import { getPatterns } from './db/patterns';
import { getScenes, setSceneBrightness } from './db/scenes';
import { getZones } from './db/zones';
import {
  init as initLIFX,
  setLightState as setLIFXLightState
} from './device/lifx';
import {
  init as initPhilipsHue,
  setLightState as setRVLLightState
} from './device/phillipsHue';
import {
  init as initRVL,
  setLightState as setPhilipsHueLightState
} from './device/rvl';
import { SetLightStateOptions } from './device/types';
import { ActionHandler } from './types';

const systemState: SystemState = {
  zoneStates: []
};

export async function init(): Promise<void> {
  await initRVL();
  await initPhilipsHue();
  await initLIFX();
  const zones = await getZones();
  for (const zone of zones) {
    systemState.zoneStates.push({
      zoneId: zone.id,
      currentSceneId: undefined,
      power: false
    });
  }
}

export function reconcile(zones: Zone[]): void {
  // Add any new zones to state that were created
  for (const zone of zones) {
    if (
      !systemState.zoneStates.find((zoneState) => zoneState.zoneId === zone.id)
    ) {
      systemState.zoneStates.push({
        zoneId: zone.id,
        currentSceneId: undefined,
        power: false
      });
    }
  }

  // Remove any zones from zone state that were deleted
  for (let i = systemState.zoneStates.length - 1; i >= 0; i--) {
    const zoneState = systemState.zoneStates[i];
    if (!zones.find((zone) => zone.id === zoneState.zoneId)) {
      systemState.zoneStates.splice(i, 1);
    }
  }

  // Update any patterns currently being displayed
  for (const zone of systemState.zoneStates) {
    if (zone.currentSceneId) {
      setZoneScene({
        zoneId: zone.zoneId,
        sceneId: zone.currentSceneId
      });
    }
  }
}

export function getSystemState(): SystemState {
  return systemState;
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

function scheduleTick(schedule: Schedule) {
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
  nextScheduleEntryStart = nextScheduleEntryStart.plus({ seconds: 15 });

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

  // If we're in the off state, signified by a missing scene ID, then turn everything off
  if (currentScheduleEntry.sceneId === undefined) {
    setZonePower({
      zoneId: schedule.zoneId,
      power: false
    });
  } else {
    setLightState({
      zoneId: schedule.zoneId,
      power: true,
      currentSceneId: currentScheduleEntry.sceneId
    });
  }
}

export const enableZoneSchedule: ActionHandler<ActionType.EnableSchedule> = async (
  request
) => {
  if (zoneTimeouts.has(request.zoneId)) {
    return;
  }
  const zoneState = getItem(request.zoneId, systemState.zoneStates, 'zoneId');
  zoneState.currentSceneId = SCHEDULE_SCENE_ID;
  scheduleTick(request);
};

export const setZoneScene: ActionHandler<ActionType.SetZoneScene> = async (
  request
) => {
  const scene = getItem(request.sceneId, await getScenes());
  const zoneState = getItem(scene.zoneId, systemState.zoneStates, 'zoneId');
  if (zoneState.currentSceneId !== request.sceneId && !zoneState.power) {
    await setZonePower({
      zoneId: scene.zoneId,
      power: true
    });
  }
  zoneState.currentSceneId = request.sceneId;
  await setLightState(zoneState);
};

export const setZoneBrightness: ActionHandler<ActionType.SetZoneBrightness> = async (
  request
) => {
  const zoneState = getItem(request.zoneId, systemState.zoneStates, 'zoneId');
  if (zoneState.currentSceneId === undefined) {
    return;
  }
  await setSceneBrightness(zoneState.currentSceneId, request.brightness);
  setLightState(zoneState);
};

export const setZonePower: ActionHandler<ActionType.SetZonePower> = async (
  request
) => {
  const zoneState = getItem(request.zoneId, systemState.zoneStates, 'zoneId');
  zoneState.power = request.power;
  await setLightState({
    ...zoneState,
    // If we're in schedule mode, we hide that from the underlying setLightState implementation
    currentSceneId:
      zoneState.currentSceneId === SCHEDULE_SCENE_ID
        ? undefined
        : zoneState.currentSceneId
  });
};

async function setLightState(zoneState: ZoneState): Promise<void> {
  const options: SetLightStateOptions = {
    zoneState,
    scene:
      zoneState.currentSceneId !== undefined
        ? getItem(zoneState.currentSceneId, getScenes())
        : undefined,
    lights: getLights(),
    patterns: getPatterns()
  };
  await Promise.allSettled([
    setRVLLightState(options),
    setPhilipsHueLightState(options),
    setLIFXLightState(options)
  ]);
}
