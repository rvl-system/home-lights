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

import { dbRun, dbAll } from '../sqlite';
import {
  LightType,
  Light,
  CreateLightRequest,
  RVLLight,
  CreateRVLLightRequest,
  PhilipsHueLight,
  CreatePhilipsHueLightRequest
} from '../common/types';
import { NUM_RVL_CHANNELS } from '../common/config';

export const LIGHT_SCHEMA = `
CREATE TABLE "lights" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  channel INTEGER UNIQUE,
  philips_hue_id TEXT,
  zone_id INTEGER,
  FOREIGN KEY (zone_id) REFERENCES zones(id)
)`;

export async function getLights(): Promise<Light[]> {
  const rawResults = await dbAll(`SELECT * FROM lights`);
  return (await rawResults).map((light) => {
    switch (light.type) {
      case LightType.RVL: {
        const rvlLight: RVLLight = {
          id: light.id,
          name: light.name,
          type: light.type,
          channel: light.channel,
          zone: light.zone_id
        };
        return rvlLight;
      }
      case LightType.PhilipsHue: {
        const hueLight: PhilipsHueLight = {
          id: light.id,
          name: light.name,
          type: light.type,
          philipsHueID: light.philips_hue_id,
          zone: light.zone_id
        };
        return hueLight;
      }
      default:
        throw new Error(`Found unknown light type in database "${light.type}"`);
    }
  });
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
      await dbRun(
        `INSERT INTO lights (name, type, channel, zone_id) values (?, ?, ?, ?)`,
        [
          rvlLightRequest.name,
          LightType.RVL,
          rvlLightRequest.channel,
          rvlLightRequest.zone
        ]
      );
      break;
    }
    case LightType.PhilipsHue: {
      const philipsHueLightRequest: CreatePhilipsHueLightRequest = lightRequest as CreatePhilipsHueLightRequest;
      await dbRun(
        `INSERT INTO lights (name, type, philips_hue_id, zone_id) values (?, ?, ?, ?)`,
        [
          philipsHueLightRequest.name,
          LightType.PhilipsHue,
          philipsHueLightRequest.philipsHueID,
          philipsHueLightRequest.zone
        ]
      );
      break;
    }
  }
}

export async function editLight(light: Light): Promise<void> {
  switch (light.type) {
    case LightType.RVL:
      const rvlLight: RVLLight = light as RVLLight;
      await dbRun(
        'UPDATE lights SET name = ?, channel = ?, zone_id=? WHERE id = ?',
        [rvlLight.name, rvlLight.channel, rvlLight.zone, rvlLight.id]
      );
      break;
    case LightType.PhilipsHue:
      const hueLight: PhilipsHueLight = light as PhilipsHueLight;
      await dbRun('UPDATE lights SET name = ?, zone_id=? WHERE id = ?', [
        hueLight.name,
        hueLight.zone,
        hueLight.id
      ]);
      break;
  }
}

export async function deleteLight(id: number): Promise<void> {
  await dbRun('DELETE FROM lights WHERE id = ?', [id]);
}
