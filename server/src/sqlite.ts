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

import { verbose, Database } from 'sqlite3';
import { deepMap } from './common/util';
import { createInternalError } from './util';

let db: Database;

export function init(dbPath: string): Promise<void> {
  const sqlite3 = verbose();
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Runs all sqlite queries queries other than SELECT
 */
export async function dbRun(
  query: string,
  parameters?: Array<string | number | undefined>
): Promise<number> {
  if (!db) {
    throw createInternalError('dbRun called before database initialized');
  }
  return new Promise((resolve, reject) => {
    db.run(query, parameters || [], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

/**
 * SELECT all rows from the database
 */
export async function dbAll(
  query: string,
  parameters: string[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Array<Record<string, any>>> {
  if (!db) {
    throw createInternalError('dbAll called before database initialized');
  }
  return new Promise((resolve, reject) => {
    db.all(query, parameters, (err, results) => {
      if (err) {
        reject(err);
      } else {
        deepMap(results, (value) => (value === null ? undefined : value));
        resolve(results);
      }
    });
  });
}

/**
 * Runs all queries, and can include multiple statements
 */
export async function dbExec(queries: string): Promise<void> {
  if (!db) {
    throw createInternalError('dbExec called before database initialized');
  }
  return new Promise((resolve, reject) => {
    db.exec(queries, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
