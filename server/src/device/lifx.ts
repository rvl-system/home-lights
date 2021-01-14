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

import { discover, Device } from 'node-lifx-lan';
import { LIFXLight, LightType } from '../common/types';
import { createLight, deleteLight, getLights } from '../db/lights';
import { SetLightStateOptions } from './types';

const lights: Device[] = [];

export async function init(): Promise<void> {
  console.log('Searching for LIFX lights...');
  lights.push(...(await discover()));

  console.log('Reconciling registered LIFX lights vs database');
  const dbLights = await getLights();

  // Add lights from LIFX that are not in the DB
  for (const light of lights) {
    if (
      !dbLights.find(
        (dbLight) =>
          dbLight.type === LightType.LIFX &&
          (dbLight as LIFXLight).lifxId === light.mac
      )
    ) {
      console.log(
        `Found LIFX light "${light.deviceInfo.label}" not in database, adding...`
      );
      const newLight: Omit<LIFXLight, 'id'> = {
        lifxId: light.mac,
        type: LightType.LIFX,
        name: light.deviceInfo.label
      };
      await createLight(newLight);
    }
  }

  // Delete lights from DB that are no longer in LIFX
  for (const dbLight of dbLights) {
    if (dbLight.type !== LightType.LIFX) {
      continue;
    }
    if (!lights.find((light) => light.mac === (dbLight as LIFXLight).lifxId)) {
      console.log(
        `LIFX light "${dbLight.name}" is no longer registered with the LIFX service, deleting...`
      );
      await deleteLight({ id: dbLight.id });
    }
  }
}

export async function setLightState({
  zoneState,
  scene,
  lights,
  patterns
}: SetLightStateOptions): Promise<void> {
  // How to set white light
  // devices[0].lightSetColor({
  //   color: {
  //     hue: 0,
  //     saturation: 0,
  //     brightness: 1,
  //     kelvin: 2700
  //   }
  // });
}
