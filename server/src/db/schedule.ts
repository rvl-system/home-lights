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

import { ActionType } from '../common/actions';
import { Scene, Schedule, Zone } from '../common/types';
import { hasItem } from '../common/util';
import { dbAll, dbRun } from '../sqlite';
import { ActionHandler } from '../types';

export const SCHEDULE_TABLE_NAME = 'schedule';
export const SCHEDULE_SCHEMA = `
CREATE TABLE "${SCHEDULE_TABLE_NAME}" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_id INTEGER NOT NULL,
  entries TEXT NOT NULL,
  FOREIGN KEY (zone_id) REFERENCES zones(id)
)`;

let schedules: Schedule[] = [];

export default async function updateCache(): Promise<void> {
  const results = await dbAll(`SELECT * FROM ${SCHEDULE_TABLE_NAME}`);
  schedules = results.map((result) => ({
    id: result.id,
    zoneId: result.zone_id,
    entries: JSON.parse((result.entries as unknown) as string)
  })) as Schedule[];
}

export async function reconcile(zones: Zone[], scenes: Scene[]): Promise<void> {
  let changesMade = false;
  const schedules = getSchedules();

  // Check if a zone was added, and create the schedule for it
  for (const zone of zones) {
    if (!hasItem(zone.id, schedules, 'zoneId')) {
      await dbRun(
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
      await dbRun(`DELETE FROM ${SCHEDULE_TABLE_NAME} WHERE id = ?`, [
        schedule.id
      ]);
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
      await dbRun(
        `UPDATE ${SCHEDULE_TABLE_NAME} SET zone_id = ?, entries = ? WHERE id = ?`,
        [schedule.zoneId, JSON.stringify(schedule.entries), schedule.id]
      );
    }
  }

  // Update the cache if changes were made
  if (changesMade) {
    await updateCache();
  }
}

export function getSchedules(): Schedule[] {
  return schedules;
}

export const editSchedule: ActionHandler<ActionType.EditSchedule> = async (
  request
) => {
  await dbRun(
    `UPDATE ${SCHEDULE_TABLE_NAME} SET zone_id = ?, entries = ? WHERE id = ?`,
    [request.zoneId, JSON.stringify(request.entries), request.id]
  );
  await updateCache();
};
