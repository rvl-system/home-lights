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

import { rgb2hsv } from '@swiftcarrot/color-fns';
import { colorTemperature2rgb } from 'color-temperature';
import {
  createManager,
  createWaveParameters,
  createSolidColorWave,
  createRainbowWave,
  createPulsingWave,
  createColorCycleWave,
  createMovingWave,
  RVLManager,
  RVLController,
  LogLevel
} from 'rvl-node';
import { SetLightStateOptions } from './types';
import { MAX_BRIGHTNESS } from '../common/config';
import {
  Color,
  ColorCyclePattern,
  ColorType,
  LightType,
  PatternType,
  PulsePattern,
  RainbowPattern,
  RVLLight,
  SolidPattern,
  WavePattern
} from '../common/types';
import { getItem } from '../common/util';
import {
  getRVLInfo,
  setRVLInterface as setRVLInterfaceInternal
} from '../db/rvl';
import { reboot } from '../reboot';

let manager: RVLManager;
const controllers = new Map<number, RVLController>();

export async function init(): Promise<void> {
  const info = await getRVLInfo();
  if (info) {
    manager = await createManager({
      networkInterface: info.networkInterface
    });
  } else {
    manager = await createManager();
  }
  console.log('RVL devices initialized');
}

export async function setRVLInterface({
  networkInterface
}: {
  networkInterface: string;
}): Promise<void> {
  if (networkInterface !== manager.networkInterface) {
    await setRVLInterfaceInternal(networkInterface);
    reboot();
  }
}

function getColor(color: Color): { hue: number; saturation: number } {
  if (color.type === ColorType.HSV) {
    return {
      hue: Math.round((color.hue * 255) / 360),
      saturation: Math.round(color.saturation * 255)
    };
  }
  const rgb = colorTemperature2rgb(color.temperature);
  const hsv = rgb2hsv(rgb.red, rgb.green, rgb.blue);
  return {
    hue: Math.round((hsv.h * 255) / 360),
    saturation: Math.round((hsv.s / 100) * 255)
  };
}

export async function setLightState({
  zoneState,
  scene,
  lights,
  patterns
}: SetLightStateOptions): Promise<void> {
  const zoneLights = lights.filter(
    (light) => light.zoneId === zoneState.zoneId
  );
  for (const rawLight of zoneLights) {
    if (rawLight.type !== LightType.RVL) {
      continue;
    }

    const light = rawLight as RVLLight;
    let controller = controllers.get(light.channel);
    if (!controller) {
      controller = await manager.createController({
        channel: light.channel,
        logLevel: LogLevel.Info
      });
      controllers.set(light.channel, controller);
    }

    if (scene === undefined || !zoneState.power) {
      controller.setPowerState(false);
      continue;
    }

    const lightEntry = getItem(light.id, scene.lights, 'lightId');
    if (lightEntry.patternId === undefined) {
      controller.setPowerState(false);
      continue;
    }

    controller.setPowerState(true);
    controller.setBrightness(scene.brightness);
    const pattern = getItem(lightEntry.patternId, patterns);
    switch (pattern.type) {
      case PatternType.ColorCycle: {
        const { data } = pattern as ColorCyclePattern;
        controller.setWaveParameters(
          createWaveParameters(createColorCycleWave(data.rate, 255))
        );
        break;
      }
      case PatternType.Pulse: {
        const { data } = pattern as PulsePattern;
        const color = getColor(data.color);
        controller.setWaveParameters(createWaveParameters());
        controller.setWaveParameters(
          createWaveParameters(
            createPulsingWave(color.hue, color.saturation, data.rate)
          )
        );
        break;
      }
      case PatternType.Rainbow: {
        const { data } = pattern as RainbowPattern;
        controller.setWaveParameters({
          ...createWaveParameters(createRainbowWave(255, data.rate)),
          distancePeriod: data.distancePeriod
        });
        break;
      }
      case PatternType.Solid: {
        const { data } = pattern as SolidPattern;
        const color = getColor(data.color);
        controller.setWaveParameters(
          createWaveParameters(
            createSolidColorWave(
              color.hue,
              color.saturation,
              Math.round((lightEntry.brightness / MAX_BRIGHTNESS) * 255)
            )
          )
        );
        break;
      }
      case PatternType.Wave: {
        const { data } = pattern as WavePattern;
        const waveColor = getColor(data.waveColor);
        const foregroundColor = getColor(data.foregroundColor);
        const backgroundColor = getColor(data.backgroundColor);
        controller.setWaveParameters({
          ...createWaveParameters(
            createMovingWave(waveColor.hue, waveColor.saturation, data.rate, 2),
            createPulsingWave(
              foregroundColor.hue,
              foregroundColor.saturation,
              data.rate
            ),
            createSolidColorWave(
              backgroundColor.hue,
              backgroundColor.saturation,
              255
            )
          ),
          distancePeriod: data.distancePeriod
        });
        break;
      }
    }
  }
}
