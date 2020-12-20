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
import initLights, { LIGHTS_SCHEMA, LIGHTS_TABLE_NAME } from './db/lights';
import initPatterns, {
  PATTERNS_SCHEMA,
  PATTERNS_TABLE_NAME,
  COLORS_SCHEMA,
  COLORS_TABLE_NAME
} from './db/patterns';
import {
  PHILIPS_HUE_INFO_SCHEMA,
  PHILIPS_HUE_TABLE_NAME
} from './db/philipsHue';
import initScenes, { SCENES_SCHEMA, SCENES_TABLE_NAME } from './db/scenes';
import initZones, { ZONES_SCHEMA, ZONES_TABLE_NAME } from './db/zones';
import { init as initDB, dbRun } from './sqlite';
import { getEnvironmentVariable } from './util';

const DB_FILE = join(
  getEnvironmentVariable('HOME'),
  '.homelights',
  'db.sqlite3'
);

export async function reset(): Promise<void> {
  console.log('Resetting database...');
  await init();
  await dbRun(`DROP TABLE ${ZONES_TABLE_NAME}`);
  await dbRun(`DROP TABLE ${SCENES_TABLE_NAME}`);
  await dbRun(`DROP TABLE ${PATTERNS_TABLE_NAME}`);
  await dbRun(`DROP TABLE ${COLORS_TABLE_NAME}`);
  await dbRun(`DROP TABLE ${LIGHTS_TABLE_NAME}`);
  await dbRun(`DROP TABLE ${PHILIPS_HUE_TABLE_NAME}`);
  await create();
  console.log('done');
}

async function create(): Promise<void> {
  console.log('Creating database tables...');
  await dbRun(ZONES_SCHEMA);
  await dbRun(SCENES_SCHEMA);
  await dbRun(PATTERNS_SCHEMA);
  await dbRun(COLORS_SCHEMA);
  await dbRun(LIGHTS_SCHEMA);
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

  await Promise.all([initZones(), initScenes(), initPatterns(), initLights()]);

  console.log('Database initialized');
}
