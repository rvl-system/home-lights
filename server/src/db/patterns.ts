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
import { Pattern } from '../common/types.js';
import { dbRun, dbAll } from '../sqlite.js';
import { ActionHandler } from '../types.js';

const PATTERNS_TABLE_NAME = 'patterns';

let patterns: Pattern[] = [];

export default function updateCache() {
  const results = dbAll<Pattern>(`SELECT * FROM ${PATTERNS_TABLE_NAME}`);
  patterns = results.map((result) => ({
    ...result,
    data: JSON.parse(result.data as unknown as string)
  }));
}

export function getPatterns(): Pattern[] {
  return patterns;
}

export const createPattern: ActionHandler<ActionType.CreatePattern> = async (
  request
) => {
  dbRun(
    `INSERT INTO ${PATTERNS_TABLE_NAME} (name, type, data) VALUES (?, ?, ?)`,
    [request.name, request.type, JSON.stringify(request.data)]
  );
  updateCache();
};

export const editPattern: ActionHandler<ActionType.EditPattern> = async (
  request
) => {
  dbRun(
    `UPDATE ${PATTERNS_TABLE_NAME} SET name = ?, type = ?, data = ? WHERE id = ?`,
    [request.name, request.type, JSON.stringify(request.data), request.id]
  );
  updateCache();
};

export const deletePattern: ActionHandler<ActionType.DeletePattern> = async (
  request
) => {
  dbRun(`DELETE FROM ${PATTERNS_TABLE_NAME} WHERE id = ?`, [request.id]);
  updateCache();
};
