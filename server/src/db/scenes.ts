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
import { MAX_BRIGHTNESS } from '../common/config';
import {
  Light,
  LightType,
  Pattern,
  PatternType,
  Scene,
  Zone
} from '../common/types';
import { getItem, hasItem } from '../common/util';
import { dbRun, dbAll } from '../sqlite';
import { ActionHandler } from '../types';

const SCENES_TABLE_NAME = 'scenes';

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
        sceneUpdated = true;
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

    // Check if any pattern types were changed that makes them no longer valid
    // for light types that only support solid patterns
    for (const lightEntry of scene.lights) {
      const light = getItem(lightEntry.lightId, lights);
      if (typeof lightEntry.patternId === 'number') {
        const pattern = getItem(lightEntry.patternId, patterns);
        if (
          light.type !== LightType.RVL &&
          pattern.type !== PatternType.Solid
        ) {
          lightEntry.patternId = undefined;
          sceneUpdated = true;
        }
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

export const createScene: ActionHandler<ActionType.CreateScene> = async (
  request
) => {
  await dbRun(
    `INSERT INTO ${SCENES_TABLE_NAME} (zone_id, name, lights) VALUES (?, ?, ?)`,
    [request.zoneId, request.name, JSON.stringify(request.lights)]
  );
  await updateCache();
};

export const editScene: ActionHandler<ActionType.EditScene> = async (
  request
) => {
  await dbRun(
    `UPDATE ${SCENES_TABLE_NAME} SET name = ?, lights = ? WHERE id = ?`,
    [request.name, JSON.stringify(request.lights), request.id]
  );
  await updateCache();
};

export const deleteScene: ActionHandler<ActionType.DeleteScene> = async (
  request
) => {
  await dbRun(`DELETE FROM ${SCENES_TABLE_NAME} WHERE id = ?`, [request.id]);
  await updateCache();
};

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
