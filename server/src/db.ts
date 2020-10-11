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
import {
  Zone,
  CreateZoneRequest,
  LightType,
  Light,
  CreateLightRequest,
  RVLLight,
  CreateRVLLightRequest,
  PhilipsHueLight,
  CreatePhilipsHueLightRequest
} from './common/types';
import { NUM_RVL_CHANNELS } from './common/config';

const DB_FILE = join(
  getEnvironmentVariable('HOME'),
  '.homelights',
  'db.sqlite3'
);

const ZONE_SCHEMA = `
CREATE TABLE "zones" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
)`;

const LIGHT_SCHEMA = `
CREATE TABLE "lights" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  channel INTEGER
)`;

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
    console.log(`Initializing new database`);
    await dbRun(ZONE_SCHEMA);
    await dbRun(LIGHT_SCHEMA);
  }
}

// ---- Zone Operations ----

export async function getZones(): Promise<Zone[]> {
  return dbAll(`SELECT * FROM zones`) as Promise<Zone[]>;
}

export async function createZone(
  zoneRequest: CreateZoneRequest
): Promise<void> {
  await dbRun(`INSERT INTO zones (name) values (?)`, [zoneRequest.name]);
}

export async function editZone(zone: Zone): Promise<void> {
  await dbRun('UPDATE zones SET name = ? WHERE id = ?', [zone.name, zone.id]);
}

export async function deleteZone(id: number): Promise<void> {
  await dbRun('DELETE FROM zones WHERE id = ?', [id]);
}

// ---- Light Operations ----

export async function getLights(): Promise<Light[]> {
  return dbAll(`SELECT * FROM lights`) as Promise<Light[]>;
}

export async function createLight(
  lightRequest: CreateLightRequest
): Promise<void> {
  switch (lightRequest.type) {
    case LightType.RVL: {
      const rvlLightRequest: CreateRVLLightRequest = lightRequest as CreateRVLLightRequest;
      if (
        !Number.isInteger(rvlLightRequest.channel) ||
        rvlLightRequest.channel < 0 ||
        rvlLightRequest.channel >= NUM_RVL_CHANNELS
      ) {
        throw new Error(`Invalid RVL channel ${rvlLightRequest.channel}`);
      }
      await dbRun(`INSERT INTO lights (name, type, channel) values (?, ?, ?)`, [
        rvlLightRequest.name,
        LightType.RVL,
        rvlLightRequest.channel
      ]);
      break;
    }
    case LightType.PhilipsHue: {
      const philipsHueLightRequest: CreatePhilipsHueLightRequest = lightRequest as CreatePhilipsHueLightRequest;
      await dbRun(`INSERT INTO lights (name, type) values (?, ?)`, [
        philipsHueLightRequest.name,
        LightType.RVL
      ]);
      break;
    }
  }
}

export async function editLight(light: Light): Promise<void> {
  switch (light.type) {
    case LightType.RVL:
      const rvlLight: RVLLight = light as RVLLight;
      await dbRun('UPDATE lights SET name = ?, channel = ? WHERE id = ?', [
        rvlLight.name,
        rvlLight.channel,
        rvlLight.id
      ]);
      break;
    case LightType.PhilipsHue:
      const hueLight: PhilipsHueLight = light as PhilipsHueLight;
      await dbRun('UPDATE lights SET name = ?, WHERE id = ?', [
        hueLight.name,
        hueLight.id
      ]);
      break;
  }
}

export async function deleteLight(id: number): Promise<void> {
  await dbRun('DELETE FROM lights WHERE id = ?', [id]);
}
