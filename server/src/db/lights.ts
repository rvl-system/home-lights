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

import { ActionType } from '../common/actions';
import { NUM_RVL_CHANNELS } from '../common/config';
import {
  LightType,
  RVLLight,
  PhilipsHueLight,
  LIFXLight,
  Zone,
  RawLight,
  Light
} from '../common/types';
import { hasItem } from '../common/util';
import { dbRun, dbAll } from '../sqlite';
import { ActionHandler } from '../types';

const LIGHTS_TABLE_NAME = 'lights';

let lights: Light[] = [];

export default function updateCache() {
  const rawResults = dbAll<RawLight>(`SELECT * FROM ${LIGHTS_TABLE_NAME}`);
  lights = rawResults.map((light) => {
    switch (light.type) {
      case LightType.RVL: {
        const { id, name, type, channel, zone_id: zoneId } = light;
        const rvlLight: RVLLight = {
          id,
          name,
          type,
          channel,
          zoneId: typeof zoneId === 'number' ? zoneId : undefined
        };
        return rvlLight;
      }
      case LightType.PhilipsHue: {
        const {
          id,
          name,
          type,
          philips_hue_id: philipsHueID,
          zone_id: zoneId
        } = light;
        const hueLight: PhilipsHueLight = {
          id,
          name,
          type,
          philipsHueID,
          zoneId: typeof zoneId === 'number' ? zoneId : undefined
        };
        return hueLight;
      }
      case LightType.LIFX: {
        const { id, name, type, lifx_id: lifxId, zone_id: zoneId } = light;
        const lifxLight: LIFXLight = {
          id,
          name,
          type,
          lifxId,
          zoneId: typeof zoneId === 'number' ? zoneId : undefined
        };
        return lifxLight;
      }
    }
  });
}

export function reconcile(zones: Zone[]) {
  let changesMade = false;
  for (const light of getLights()) {
    if (!hasItem(light.zoneId, zones)) {
      dbRun(`UPDATE ${LIGHTS_TABLE_NAME} SET zone_id = null WHERE id = ?`, [
        light.id
      ]);
      changesMade = true;
    }
  }
  if (changesMade) {
    updateCache();
  }
}

export function getLights(): Light[] {
  return lights;
}

export const createRVLLight: ActionHandler<ActionType.CreateRVLLight> = async (
  request
) => {
  createLight({
    ...request,
    type: LightType.RVL
  });
};

export function createLight(createLightRequest: Omit<Light, 'id'>) {
  switch (createLightRequest.type) {
    case LightType.RVL: {
      const rvlLightRequest = createLightRequest as Omit<RVLLight, 'id'>;
      if (
        !Number.isInteger(rvlLightRequest.channel) ||
        rvlLightRequest.channel < 0 ||
        rvlLightRequest.channel >= NUM_RVL_CHANNELS
      ) {
        throw new Error(`Invalid RVL channel ${rvlLightRequest.channel}`);
      }
      dbRun(
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
      const philipsHueLightRequest = createLightRequest as Omit<
        PhilipsHueLight,
        'id'
      >;
      dbRun(
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
      const lifxLightRequest = createLightRequest as Omit<LIFXLight, 'id'>;
      dbRun(
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
  updateCache();
}

export const editLight: ActionHandler<ActionType.EditLight> = async (
  request
) => {
  switch (request.type) {
    case LightType.RVL: {
      const rvlLight: RVLLight = request as RVLLight;
      dbRun(
        `UPDATE ${LIGHTS_TABLE_NAME} SET name = ?, channel = ?, zone_id = ? WHERE id = ?`,
        [rvlLight.name, rvlLight.channel, rvlLight.zoneId, rvlLight.id]
      );
      break;
    }
    case LightType.PhilipsHue: {
      const hueLight: PhilipsHueLight = request as PhilipsHueLight;
      dbRun(
        `UPDATE ${LIGHTS_TABLE_NAME} SET name = ?, zone_id = ? WHERE id = ?`,
        [hueLight.name, hueLight.zoneId, hueLight.id]
      );
      break;
    }
    case LightType.LIFX: {
      const lifxLight: LIFXLight = request as LIFXLight;
      dbRun(
        `UPDATE ${LIGHTS_TABLE_NAME} SET name = ?, zone_id = ? WHERE id = ?`,
        [lifxLight.name, lifxLight.zoneId, lifxLight.id]
      );
      break;
    }
  }
  updateCache();
};

export const deleteLight: ActionHandler<ActionType.DeleteLight> = async (
  request
) => {
  dbRun(`DELETE FROM ${LIGHTS_TABLE_NAME} WHERE id = ?`, [request.id]);
  updateCache();
};
