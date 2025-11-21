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

import { ActionType } from '../common/actions.js';
import { Scene, Schedule, Zone, RawSchedule } from '../common/types.js';
import { hasItem } from '../common/util.js';
import { dbAll, dbRun } from '../sqlite.js';
import { ActionHandler } from '../types.js';

const SCHEDULE_TABLE_NAME = 'schedule';

let schedules: Schedule[] = [];

export default function updateCache() {
  const results = dbAll<RawSchedule>(`SELECT * FROM ${SCHEDULE_TABLE_NAME}`);
  schedules = results.map((result) => ({
    id: result.id,
    zoneId: result.zone_id,
    entries: JSON.parse(result.entries as unknown as string)
  }));
}

export function reconcile(zones: Zone[], scenes: Scene[]) {
  let changesMade = false;
  const schedules = getSchedules();

  // Check if a zone was added, and create the schedule for it
  for (const zone of zones) {
    if (!hasItem(zone.id, schedules, 'zoneId')) {
      dbRun(
        `INSERT INTO ${SCHEDULE_TABLE_NAME} (zone_id, entries) VALUES (?, ?)`,
        [zone.id, JSON.stringify([])]
      );
      changesMade = true;
    }
  }

  // Check if the zone a schedule uses was deleted, and delete it if so
  for (let i = schedules.length - 1; i >= 0; i--) {
    const schedule = schedules[i];
    if (!hasItem(schedule.zoneId, zones)) {
      dbRun(`DELETE FROM ${SCHEDULE_TABLE_NAME} WHERE id = ?`, [schedule.id]);
      schedules.splice(i, 1);
      changesMade = true;
    }
  }

  // Check if the scene a schedule uses was deleted, and delete it if so
  for (const schedule of schedules) {
    let scheduleUpdated = false;
    for (const entry of schedule.entries) {
      if (
        typeof entry.sceneId === 'number' &&
        !hasItem(entry.sceneId, scenes)
      ) {
        entry.sceneId = undefined;
        scheduleUpdated = true;
        changesMade = true;
      }
    }
    if (scheduleUpdated) {
      dbRun(
        `UPDATE ${SCHEDULE_TABLE_NAME} SET zone_id = ?, entries = ? WHERE id = ?`,
        [schedule.zoneId, JSON.stringify(schedule.entries), schedule.id]
      );
    }
  }

  // Update the cache if changes were made
  if (changesMade) {
    updateCache();
  }
}

export function getSchedules(): Schedule[] {
  return schedules;
}

export const editSchedule: ActionHandler<ActionType.EditSchedule> = async (
  request
) => {
  dbRun(
    `UPDATE ${SCHEDULE_TABLE_NAME} SET zone_id = ?, entries = ? WHERE id = ?`,
    [request.zoneId, JSON.stringify(request.entries), request.id]
  );
  updateCache();
};
