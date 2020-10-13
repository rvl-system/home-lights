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

import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { getEnvironmentVariable } from './util';
import { init as initDB, dbRun, dbAll } from './sqlite';
import { ZONE_SCHEMA } from './db/zones';
import { LIGHT_SCHEMA } from './db/lights';
import { PHILIPS_HUE_INFO_SCHEMA } from './db/philipsHue';

const DB_FILE = join(
  getEnvironmentVariable('HOME'),
  '.homelights',
  'db.sqlite3'
);

export async function reset(): Promise<void> {
  console.log('Resetting database...');
  await init();
  await dbAll(`DROP TABLE zones`);
  await dbAll(`DROP TABLE lights`);
  await dbAll(`DROP TABLE philips_hue_info`);
  await create();
  console.log('done');
}

async function create(): Promise<void> {
  console.log(`Creating database tables...`);
  await dbRun(ZONE_SCHEMA);
  await dbRun(LIGHT_SCHEMA);
  await dbRun(PHILIPS_HUE_INFO_SCHEMA);
}

export async function init(): Promise<void> {
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
    await create();
  }
  console.log('Database initialized');
}
