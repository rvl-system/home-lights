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
  createManager,
  createWaveParameters,
  createSolidColorWave,
  RVLManager,
  RVLController
} from 'rvl-node';
import { MAX_BRIGHTNESS } from '../common/config';
import {
  LightType,
  PatternType,
  RVLLight,
  SolidPattern
} from '../common/types';
import { getItem } from '../common/util';
import { SetLightStateOptions } from './types';

let manager: RVLManager;
const controllers = new Map<number, RVLController>();

export async function init(): Promise<void> {
  manager = await createManager();
  // Devices are initialized on a per-channel basis, so we do nothing here
  console.log('RVL devices initialized');
}

export async function setLightState({
  zoneState,
  scene,
  lights,
  patterns
}: SetLightStateOptions): Promise<void> {
  if (zoneState.currentSceneId === undefined) {
    return;
  }

  for (const lightEntry of scene.lights) {
    const light = getItem(lightEntry.lightId, lights) as RVLLight;
    if (light.type !== LightType.RVL) {
      continue;
    }
    let controller = controllers.get(light.channel);
    if (!controller) {
      controller = await manager.createController({
        channel: light.channel
      });
      controllers.set(light.channel, controller);
    }

    if (zoneState.power && lightEntry.patternId !== undefined) {
      controller.setPowerState(true);
      controller.setBrightness(scene.brightness);
      const pattern = getItem(lightEntry.patternId, patterns);
      switch (pattern.type) {
        case PatternType.Solid: {
          const { data } = pattern as SolidPattern;
          controller.setWaveParameters(
            createWaveParameters(
              createSolidColorWave(
                Math.round((data.color.hue / 360) * 255),
                Math.round(data.color.saturation * 255),
                Math.round((lightEntry.brightness / MAX_BRIGHTNESS) * 255)
              )
            )
          );
          break;
        }
      }
    } else {
      controller.setPowerState(false);
    }
  }
}
