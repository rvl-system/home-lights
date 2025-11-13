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

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync
} from 'fs';
import { dirname, join } from 'path';
import { Migration } from '../common/types';
import { dbAll, dbExec, init as initDB } from '../sqlite';
import { DB_FILE } from '../util';

const SCHEMA_FOLDER = join(__dirname, '..', '..', 'db');

export const MIGRATIONS_TABLE_NAME = 'migrations';

export interface Migrations {
  version: number;
}

export default function init() {
  const isNewDB = !existsSync(DB_FILE);
  if (isNewDB) {
    mkdirSync(dirname(DB_FILE), {
      recursive: true
    });
    console.log(`Creating database at ${DB_FILE}`);
  } else {
    console.log(`Loading database from ${DB_FILE}`);
  }

  initDB(DB_FILE);

  if (isNewDB) {
    console.log('Creating database tables...');
    dbExec(readFileSync(join(SCHEMA_FOLDER, 'schema.sql')).toString());
  } else {
    // Figure out which migrations to apply. If the migrations table is missing,
    // assume all migrations are needed
    const tableExists = !!dbAll<{ count: number }>(
      `SELECT count(*) AS count FROM sqlite_master WHERE type='table' AND name='${MIGRATIONS_TABLE_NAME}'`
    )[0].count;
    let migrationStart = -1;
    if (tableExists) {
      // If the table exists, let's find whatever the most recent migration was
      const migrations = dbAll<Migration>(
        `SELECT migration FROM ${MIGRATIONS_TABLE_NAME} ORDER BY migration DESC LIMIT 1`
      );
      // If there are no migrations, that means this was a recent install and we should initialize it to the latest migration
      if (!migrations.length) {
        const migrations = readdirSync(join(SCHEMA_FOLDER, 'migrations'))
          .map((f) => parseInt(f))
          .sort();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        migrationStart = migrations.pop()!;
        dbExec(`INSERT INTO migrations(migration) VALUES (${migrationStart});`);
      } else {
        migrationStart = migrations[0].migration;
      }
    }

    // Read the list of all migrations, filter out any that have already been run, and sort them
    const migrationFiles = readdirSync(join(SCHEMA_FOLDER, 'migrations'))
      .filter((file) => parseInt(file) > migrationStart)
      .sort((a, b) => parseInt(a) - parseInt(b));

    // Back up the old database
    if (migrationFiles.length) {
      const backupFileName = `${DB_FILE}.${Date.now()}.backup`;
      console.log(
        `Backing up database to ${backupFileName} before applying migrations`
      );
      copyFileSync(DB_FILE, backupFileName);
    }

    // Apply each migration in order
    for (const migrationFile of migrationFiles) {
      console.log(`Applying migration "${migrationFile}"`);
      const migration = readFileSync(
        join(SCHEMA_FOLDER, 'migrations', migrationFile)
      ).toString();
      dbExec(`
BEGIN TRANSACTION;
${migration}
INSERT INTO migrations(migration) VALUES (${parseInt(migrationFile)});
COMMIT;
      `);
    }
  }
}
