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

import { Pattern, CreatePatternRequest } from '../common/types';
import { dbRun, dbAll } from '../sqlite';

export const PATTERN_TABLE_NAME = 'patterns';
export const PATTERN_SCHEMA = `
CREATE TABLE "${PATTERN_TABLE_NAME}" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  data TEXT NOT NULL
)`;

export const COLORS_TABLE_NAME = 'colors';
export const COLORS_SCHEMA = `
CREATE TABLE "${COLORS_TABLE_NAME}" (
  hue INTEGER NOT NULL,
  saturation INTEGER NOT NULL,
  PRIMARY KEY (hue, saturation)
)`;

export async function getPatterns(): Promise<Pattern[]> {
  const results: Pattern[] = (await dbAll(
    'SELECT * FROM patterns'
  )) as Pattern[];
  return results.map((result) => ({
    ...result,
    data: JSON.parse((result.data as unknown) as string)
  }));
}

async function updateColors() {
  // TODO: https://github.com/rvl-system/home-lights/issues/36
}

export async function createPattern(
  pattern: CreatePatternRequest
): Promise<void> {
  await dbRun(
    `INSERT INTO ${PATTERN_TABLE_NAME} (name, type, data) values (?, ?, ?)`,
    [pattern.name, pattern.type, JSON.stringify(pattern.data)]
  );
  await updateColors();
}

export async function editPattern(pattern: Pattern): Promise<void> {
  await dbRun(
    `UPDATE ${PATTERN_TABLE_NAME} SET name = ?, type = ?, data = ? WHERE id = ?`,
    [pattern.name, pattern.type, JSON.stringify(pattern.data), pattern.id]
  );
  await updateColors();
}

export async function deletePattern(id: number): Promise<void> {
  await dbRun(`DELETE FROM ${PATTERN_TABLE_NAME} WHERE id = ?`, [id]);
  await updateColors();
}
