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
import { Pattern } from '../common/types';
import { dbRun, dbAll } from '../sqlite';
import { ActionHandler } from '../types';

export const PATTERNS_TABLE_NAME = 'patterns';
export const PATTERNS_SCHEMA = `
CREATE TABLE "${PATTERNS_TABLE_NAME}" (
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

let patterns: Pattern[] = [];

export default async function updateCache(): Promise<void> {
  const results = await dbAll('SELECT * FROM patterns');
  patterns = results.map((result) => ({
    ...result,
    data: JSON.parse((result.data as unknown) as string)
  })) as Pattern[];
}

export function getPatterns(): Pattern[] {
  return patterns;
}

export const createPattern: ActionHandler<ActionType.CreatePattern> = async (
  request
) => {
  await dbRun(
    `INSERT INTO ${PATTERNS_TABLE_NAME} (name, type, data) VALUES (?, ?, ?)`,
    [request.name, request.type, JSON.stringify(request.data)]
  );
  await updateCache();
};

export const editPattern: ActionHandler<ActionType.EditPattern> = async (
  request
) => {
  await dbRun(
    `UPDATE ${PATTERNS_TABLE_NAME} SET name = ?, type = ?, data = ? WHERE id = ?`,
    [request.name, request.type, JSON.stringify(request.data), request.id]
  );
  await updateCache();
};

export const deletePattern: ActionHandler<ActionType.DeletePattern> = async (
  request
) => {
  await dbRun(`DELETE FROM ${PATTERNS_TABLE_NAME} WHERE id = ?`, [request.id]);
  await updateCache();
};
