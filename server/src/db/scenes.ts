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

import { MAX_BRIGHTNESS } from '../common/config';
import {
  CreateSceneRequest,
  Light,
  Pattern,
  Scene,
  Zone
} from '../common/types';
import { getItem, hasItem } from '../common/util';
import { dbRun, dbAll } from '../sqlite';

export const SCENES_TABLE_NAME = 'scenes';
export const SCENES_SCHEMA = `
CREATE TABLE "${SCENES_TABLE_NAME}" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lights TEXT NOT NULL,
  brightness INTEGER NOT NULL DEFAULT ${MAX_BRIGHTNESS},
  zone_id INTEGER,
  FOREIGN KEY (zone_id) REFERENCES zones(id),
  UNIQUE (name, zone_id)
)`;

let scenes: Scene[] = [];

export default async function updateCache(): Promise<void> {
  const rows = await dbAll(`SELECT * FROM ${SCENES_TABLE_NAME}`);
  scenes = rows.map(
    (row): Scene => ({
      id: row.id,
      name: row.name,
      lights: JSON.parse(row.lights),
      brightness: row.brightness,
      zoneId: row.zone_id
    })
  );
}

export async function reconcile(
  zones: Zone[],
  patterns: Pattern[],
  lights: Light[]
): Promise<void> {
  let changesMade = false;
  const scenes = getScenes();

  // Check if the zone a scene is in was deleted, and delete it if so
  for (let i = scenes.length - 1; i >= 0; i--) {
    const scene = scenes[i];
    if (!hasItem(scene.zoneId, zones)) {
      await dbRun(`DELETE FROM ${SCENES_TABLE_NAME} WHERE id = ?`, [scene.id]);
      scenes.splice(i, 1);
      changesMade = true;
    }
  }

  // Next, check if any lights were added or deleted, or if patterns were deleted
  for (const scene of scenes) {
    let sceneUpdated = false;
    const lightEntries = scene.lights;
    for (let i = lightEntries.length - 1; i >= 0; i--) {
      const lightEntry = lightEntries[i];
      if (
        !hasItem(lightEntry.lightId, lights) ||
        getItem(lightEntry.lightId, lights).zoneId !== scene.zoneId
      ) {
        // If the light no longer exists or was moved to a different zone, delete it
        lightEntries.splice(i, 1);
      } else if (!hasItem(lightEntry.patternId, patterns)) {
        // If the pattern for the light no longer exists, unassign it
        lightEntry.patternId = undefined;
        sceneUpdated = true;
      }
    }

    // Check if there were any lights added to the zone for this scene
    for (const light of lights) {
      if (
        scene.zoneId === light.zoneId &&
        !hasItem(light.id, scene.lights, 'lightId')
      ) {
        scene.lights.push({
          lightId: light.id,
          brightness: MAX_BRIGHTNESS
        });
        sceneUpdated = true;
      }
    }

    // If the lights were updated, save the changes to the database
    if (sceneUpdated) {
      await dbRun(`UPDATE ${SCENES_TABLE_NAME} SET lights = ? WHERE id = ?`, [
        JSON.stringify(scene.lights),
        scene.id
      ]);
      changesMade = true;
    }
  }

  // Update the cache if changes were made
  if (changesMade) {
    await updateCache();
  }
}

export function getScenes(): Scene[] {
  return scenes;
}

export async function createScene(
  sceneRequest: CreateSceneRequest
): Promise<void> {
  await dbRun(
    `INSERT INTO ${SCENES_TABLE_NAME} (zone_id, name, lights) VALUES (?, ?, ?)`,
    [
      sceneRequest.zoneId,
      sceneRequest.name,
      JSON.stringify(sceneRequest.lights)
    ]
  );
  await updateCache();
}

export async function editScene(scene: Scene): Promise<void> {
  await dbRun(
    `UPDATE ${SCENES_TABLE_NAME} SET name = ?, lights = ? WHERE id = ?`,
    [scene.name, JSON.stringify(scene.lights), scene.id]
  );
  await updateCache();
}

export async function deleteScene(id: number): Promise<void> {
  await dbRun(`DELETE FROM ${SCENES_TABLE_NAME} WHERE id = ?`, [id]);
  await updateCache();
}

export async function setSceneBrightness(
  id: number,
  brightness: number
): Promise<void> {
  await dbRun(`UPDATE ${SCENES_TABLE_NAME} SET brightness = ? WHERE id = ?`, [
    brightness,
    id
  ]);
  await updateCache();
}
