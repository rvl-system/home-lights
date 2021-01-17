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

import { existsSync, mkdirSync, readFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { dbAll, dbExec, init as initDB } from '../sqlite';
import { getEnvironmentVariable } from '../util';

const DB_FILE = join(
  getEnvironmentVariable('HOME'),
  '.homelights',
  'db.sqlite3'
);

const SCHEMA_FOLDER = join(__dirname, '..', '..', 'db');

export const MIGRATIONS_TABLE_NAME = 'migrations';

export interface Migrations {
  version: number;
}

export default async function init(): Promise<void> {
  const isNewDB = !existsSync(DB_FILE);
  if (isNewDB) {
    mkdirSync(dirname(DB_FILE), {
      recursive: true
    });
    console.log(`Creating database at ${DB_FILE}`);
  } else {
    console.log(`Loading database from ${DB_FILE}`);
  }

  await initDB(DB_FILE);

  if (isNewDB) {
    console.log('Creating database tables...');
    await dbExec(readFileSync(join(SCHEMA_FOLDER, 'schema.sql')).toString());
  } else {
    // Figure out which migrations to apply. If the migrations table is missing,
    // assume all migrations are needed
    const tableExists = !!(
      await dbAll(
        `SELECT count(*) AS count FROM sqlite_master WHERE type='table' AND name='${MIGRATIONS_TABLE_NAME}'`
      )
    )[0].count;
    let migrationStart = -1;
    if (tableExists) {
      // If the table exists, let's find whatever the most recent migration was
      migrationStart = (
        await dbAll(
          `SELECT migration FROM ${MIGRATIONS_TABLE_NAME} ORDER BY migration DESC LIMIT 1`
        )
      )[0].migration;
    }

    // Read the list of all migrations, filter out any that have already been run, and sort them
    const migrationFiles = readdirSync(join(SCHEMA_FOLDER, 'migrations'))
      .filter((file) => parseInt(file) > migrationStart)
      .sort((a, b) => parseInt(a) - parseInt(b));

    // Apply each migration in order
    for (const migrationFile of migrationFiles) {
      console.log(`Applying migration "${migrationFile}"`);
      const migration = readFileSync(
        join(SCHEMA_FOLDER, 'migrations', migrationFile)
      ).toString();
      await dbExec(`
BEGIN TRANSACTION;
${migration}
INSERT INTO migrations(migration) VALUES (${parseInt(migrationFile)});
COMMIT;
      `);
    }
  }
}
