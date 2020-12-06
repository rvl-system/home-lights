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
import { CreateSceneRequest, Scene } from '../common/types';
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

export async function init(): Promise<void> {
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
  await init();
}

export async function editScene(scene: Scene): Promise<void> {
  await dbRun(
    `UPDATE ${SCENES_TABLE_NAME} SET name = ?, lights = ? WHERE id = ?`,
    [scene.name, JSON.stringify(scene.lights), scene.id]
  );
  await init();
}

export async function deleteScene(id: number): Promise<void> {
  await dbRun(`DELETE FROM ${SCENES_TABLE_NAME} WHERE id = ?`, [id]);
  await init();
}

export async function setSceneBrightness(
  id: number,
  brightness: number
): Promise<void> {
  await dbRun(`UPDATE ${SCENES_TABLE_NAME} SET brightness = ? WHERE id = ?`, [
    brightness,
    id
  ]);
  await init();
}
