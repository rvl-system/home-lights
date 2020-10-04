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
  HueLight,
  CreatePhilipsHueLightRequest
} from '../common/types';
import { NUM_RVL_CHANNELS } from '../common/config';

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
      const hueLight: HueLight = light as HueLight;
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
