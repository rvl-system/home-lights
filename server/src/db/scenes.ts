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

import { CreateSceneRequest, Scene } from '../common/types';
import { dbRun, dbAll } from '../sqlite';

export const SCENES_TABLE_NAME = 'scenes';
export const SCENES_SCHEMA = `
CREATE TABLE "${SCENES_TABLE_NAME}" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  lights TEXT NOT NULL,
  zone_id INTEGER,
  FOREIGN KEY (zone_id) REFERENCES zones(id)
)`;

export async function getScenes(): Promise<Scene[]> {
  const rows = await dbAll(`SELECT * FROM ${SCENES_TABLE_NAME}`);
  return rows.map(
    (row): Scene => ({
      id: row.id,
      name: row.name,
      zoneId: row.zone_id,
      lights: JSON.parse(row.lights)
    })
  );
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
}

export async function editScene(scene: Scene): Promise<void> {
  await dbRun(
    `UPDATE ${SCENES_TABLE_NAME} SET name = ?, lights = ? WHERE id = ?`,
    [scene.name, JSON.stringify(scene.lights), scene.id]
  );
}

export async function deleteScene(id: number): Promise<void> {
  await dbRun(`DELETE FROM ${SCENES_TABLE_NAME} WHERE id = ?`, [id]);
}
