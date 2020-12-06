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

import fetch from 'node-fetch';
import { MAX_BRIGHTNESS } from '../common/config';
import {
  LightType,
  LIFXLight,
  CreateLIFXLightRequest,
  PatternType,
  SolidPattern
} from '../common/types';
import { getItem } from '../common/util';
import { getLights, createLight, deleteLight } from '../db/lights';
import { SetLightStateOptions } from './types';

const LIFX_URL = 'https://api.lifx.com/v1/lights';
const TOKEN = process.env['LIFX_TOKEN'];
const LOCATION = process.env['LIFX_LOCATION'];

// We're matching the LIFX API here, which uses snake_case, so disable the linter rule
/* eslint-disable @typescript-eslint/naming-convention */
interface LIFXBulbDescriptor {
  id: string;
  uuid: string;
  label: string;
  connected: boolean;
  power: 'on' | 'off';
  color: {
    hue: number;
    saturation: number;
    kelvin: number;
  };
  brightness: number;
  group: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
  product: {
    name: string;
    identifier: string;
    company: string;
    vendor_id: number;
    product_id: number;
    capabilities: {
      has_color: boolean;
      has_variable_color_temp: boolean;
      has_ir: boolean;
      has_chain: boolean;
      has_multizone: boolean;
      min_kelvin: number;
      max_kelvin: number;
    };
  };
  last_seen: string;
  seconds_since_seen: number;
}
/* eslint-enable @typescript-eslint/naming-convention */

async function getLIFXLights(
  token: string,
  location: string
): Promise<LIFXBulbDescriptor[]> {
  const response = await fetch(`${LIFX_URL}/location:${location}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  });
  return await response.json();
}

async function updateLights(token: string, location: string): Promise<void> {
  console.log('Reconciling LIFX lights in bridge vs database');
  const lights = await getLIFXLights(token, location);
  const dbLights = await getLights();

  // Add lights from LIFX that are not in the DB
  for (const light of lights) {
    if (
      !dbLights.find(
        (dbLight) =>
          dbLight.type === LightType.LIFX &&
          (dbLight as LIFXLight).lifxId === light.id
      )
    ) {
      console.log(
        `Found LIFX light "${light.label}" not in database, adding...`
      );
      const newLight: CreateLIFXLightRequest = {
        lifxId: light.id,
        type: LightType.LIFX,
        name: light.label
      };
      await createLight(newLight);
    }
  }

  // Delete lights from DB that are no longer in LIFX
  for (const dbLight of dbLights) {
    if (dbLight.type !== LightType.LIFX) {
      continue;
    }
    if (!lights.find((light) => light.id === (dbLight as LIFXLight).lifxId)) {
      console.log(
        `LIFX light "${dbLight.name}" is no longer registered with the LIFX service, deleting...`
      );
      await deleteLight(dbLight.id);
    }
  }
}

export async function init(): Promise<void> {
  if (!TOKEN) {
    console.log('No LIFX token found, disabling LIFX support');
    return;
  }
  if (!LOCATION) {
    throw new Error('LIFX_LOCATION environment variable is required');
  }
  console.log('Discovering LIFX lights');
  await updateLights(TOKEN, LOCATION);
}

interface LIFXLightConfig {
  id: string;
  power: 'on' | 'off';
  color: {
    hue: number; // 0-360
    saturation: number; // 0-1
    brightness: number; // 0-1
  };
}

async function sendLightStates(token: string, config: LIFXLightConfig[]) {
  const response = await fetch(`${LIFX_URL}/states`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      states: config.map((entry) => ({
        selector: `id:${entry.id}`,
        power: entry.power,
        color: entry.color,
        fast: true
      }))
    })
  });
  return await response.json();
}

export async function setLightState({
  zoneState,
  scene,
  lights,
  patterns
}: SetLightStateOptions): Promise<void> {
  if (!TOKEN || !LOCATION || zoneState.currentSceneId === undefined) {
    return;
  }
  const config: LIFXLightConfig[] = [];
  for (const lightEntry of scene.lights) {
    const light = getItem(lightEntry.lightId, lights);
    if (light.type !== LightType.LIFX) {
      continue;
    }

    const color = {
      hue: 0,
      saturation: 0,
      brightness: 0
    };
    if (lightEntry.patternId !== undefined) {
      const pattern = getItem(lightEntry.patternId, patterns) as SolidPattern;
      if (pattern.type !== PatternType.Solid) {
        throw new Error(
          `Internal Error: pattern type ${pattern.type} cannot be used with LIFX`
        );
      }
      color.hue = pattern.data.color.hue;
      color.saturation = pattern.data.color.saturation;
      color.brightness =
        (lightEntry.brightness / MAX_BRIGHTNESS) *
        (scene.brightness / MAX_BRIGHTNESS);
    }
    config.push({
      id: (light as LIFXLight).lifxId,
      power: zoneState.power ? 'on' : 'off',
      color
    });
  }

  await sendLightStates(TOKEN, config);
}
