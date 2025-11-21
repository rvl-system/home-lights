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

import sqlite3, { type Database } from 'better-sqlite3';
import { createInternalError, deepMap } from './common/util.js';

let db: Database;

export function init(dbPath: string) {
  db = sqlite3(dbPath);
}

/**
 * Runs all sqlite queries queries other than SELECT
 */
export function dbRun(
  query: string,
  parameters?: Array<string | number | undefined>
) {
  if (!db) {
    throw createInternalError('dbRun called before database initialized');
  }
  const stmt = db.prepare(query);
  const result = stmt.run(parameters || []);
  return result.lastInsertRowid;
}

/**
 * SELECT all rows from the database
 */
export function dbAll<T>(query: string, parameters: string[] = []): T[] {
  if (!db) {
    throw createInternalError('dbAll called before database initialized');
  }
  return deepMap(db.prepare(query).all(parameters), (value) =>
    value === null ? undefined : value
  ) as T[];
}

/**
 * Runs all queries, and can include multiple statements
 */
export function dbExec(queries: string) {
  if (!db) {
    throw createInternalError('dbExec called before database initialized');
  }
  db.exec(queries);
}
