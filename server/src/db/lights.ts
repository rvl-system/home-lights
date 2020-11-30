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

import { NUM_RVL_CHANNELS } from '../common/config';
import {
  LightType,
  Light,
  CreateLightRequest,
  RVLLight,
  CreateRVLLightRequest,
  PhilipsHueLight,
  CreatePhilipsHueLightRequest,
  CreateLIFXLightRequest,
  LIFXLight
} from '../common/types';
import { dbRun, dbAll } from '../sqlite';

export const LIGHTS_TABLE_NAME = 'lights';
export const LIGHTS_SCHEMA = `
CREATE TABLE "${LIGHTS_TABLE_NAME}" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  channel INTEGER UNIQUE,
  philips_hue_id TEXT UNIQUE,
  lifx_id TEXT UNIQUE,
  zone_id INTEGER,
  FOREIGN KEY (zone_id) REFERENCES zones(id)
)`;

export async function getLights(): Promise<Light[]> {
  const rawResults = await dbAll(`SELECT * FROM ${LIGHTS_TABLE_NAME}`);
  return rawResults.map((light) => {
    switch (light.type) {
      case LightType.RVL: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { id, name, type, channel, zone_id: zoneId } = light;
        const rvlLight: RVLLight = {
          id,
          name,
          type,
          channel,
          zoneId
        };
        return rvlLight;
      }
      case LightType.PhilipsHue: {
        const {
          id,
          name,
          type,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          philips_hue_id: philipsHueID,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          zone_id: zoneId
        } = light;
        const hueLight: PhilipsHueLight = {
          id,
          name,
          type,
          philipsHueID,
          zoneId
        };
        return hueLight;
      }
      case LightType.LIFX: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { id, name, type, lifx_id: lifxId, zone_id: zoneId } = light;
        const lifxLight: LIFXLight = {
          id,
          name,
          type,
          lifxId,
          zoneId
        };
        return lifxLight;
      }
      default:
        throw new Error(`Found unknown light type in database "${light.type}"`);
    }
  });
}

export async function createLight(
  createLightRequest: CreateLightRequest
): Promise<void> {
  switch (createLightRequest.type) {
    case LightType.RVL: {
      const rvlLightRequest: CreateRVLLightRequest = createLightRequest as CreateRVLLightRequest;
      if (
        !Number.isInteger(rvlLightRequest.channel) ||
        rvlLightRequest.channel < 0 ||
        rvlLightRequest.channel >= NUM_RVL_CHANNELS
      ) {
        throw new Error(`Invalid RVL channel ${rvlLightRequest.channel}`);
      }
      await dbRun(
        `INSERT INTO ${LIGHTS_TABLE_NAME} (name, type, channel, zone_id) VALUES (?, ?, ?, ?)`,
        [
          rvlLightRequest.name,
          LightType.RVL,
          rvlLightRequest.channel,
          rvlLightRequest.zoneId
        ]
      );
      break;
    }
    case LightType.PhilipsHue: {
      const philipsHueLightRequest: CreatePhilipsHueLightRequest = createLightRequest as CreatePhilipsHueLightRequest;
      await dbRun(
        `INSERT INTO ${LIGHTS_TABLE_NAME} (name, type, philips_hue_id, zone_id) VALUES (?, ?, ?, ?)`,
        [
          philipsHueLightRequest.name,
          LightType.PhilipsHue,
          philipsHueLightRequest.philipsHueID,
          philipsHueLightRequest.zoneId
        ]
      );
      break;
    }
    case LightType.LIFX: {
      const lifxLightRequest: CreateLIFXLightRequest = createLightRequest as CreateLIFXLightRequest;
      await dbRun(
        `INSERT INTO ${LIGHTS_TABLE_NAME} (name, type, lifx_id, zone_id) VALUES (?, ?, ?, ?)`,
        [
          lifxLightRequest.name,
          LightType.LIFX,
          lifxLightRequest.lifxId,
          lifxLightRequest.zoneId
        ]
      );
      break;
    }
  }
}

export async function editLight(light: Light): Promise<void> {
  switch (light.type) {
    case LightType.RVL: {
      const rvlLight: RVLLight = light as RVLLight;
      await dbRun(
        `UPDATE ${LIGHTS_TABLE_NAME} SET name = ?, channel = ?, zone_id = ? WHERE id = ?`,
        [rvlLight.name, rvlLight.channel, rvlLight.zoneId, rvlLight.id]
      );
      break;
    }
    case LightType.PhilipsHue: {
      const hueLight: PhilipsHueLight = light as PhilipsHueLight;
      await dbRun(
        `UPDATE ${LIGHTS_TABLE_NAME} SET name = ?, zone_id = ? WHERE id = ?`,
        [hueLight.name, hueLight.zoneId, hueLight.id]
      );
      break;
    }
    case LightType.LIFX: {
      const lifxLight: LIFXLight = light as LIFXLight;
      await dbRun(
        `UPDATE ${LIGHTS_TABLE_NAME} SET name = ?, zone_id = ? WHERE id = ?`,
        [lifxLight.name, lifxLight.zoneId, lifxLight.id]
      );
      break;
    }
  }
}

export async function deleteLight(id: number): Promise<void> {
  await dbRun(`DELETE FROM ${LIGHTS_TABLE_NAME} WHERE id = ? AND type = ?`, [
    id,
    LightType.RVL
  ]);
}
