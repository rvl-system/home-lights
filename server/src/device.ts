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

import { SCHEDULE_SCENE_ID } from './common/config';
import { Scene, SystemState, ZoneState } from './common/types';
import { getItem } from './common/util';
import { getLights } from './db/lights';
import { getPatterns } from './db/patterns';
import { getRVLInfo } from './db/rvl';
import { getScenes } from './db/scenes';
import { getZoneStates } from './db/zoneStates';
import {
  init as initLIFX,
  setLightState as setLIFXLightState
} from './device/lifx';
import {
  getPhilipsHueBridgeIp,
  init as initPhilipsHue,
  setLightState as setRVLLightState
} from './device/phillipsHue';
import {
  init as initRVL,
  setLightState as setPhilipsHueLightState
} from './device/rvl';
import { SetLightStateOptions } from './device/types';

export async function init(): Promise<void> {
  await initRVL();
  await initPhilipsHue();
  await initLIFX();
}

export function getSystemState(): SystemState {
  return {
    zoneStates: getZoneStates(),
    philipsHueBridgeIp: getPhilipsHueBridgeIp(),
    rvlInfo: getRVLInfo()
  };
}

export async function reconcile(zoneStates: ZoneState[]): Promise<void> {
  for (const zoneState of zoneStates) {
    let scene: Scene | undefined;
    if (zoneState.currentSceneId === SCHEDULE_SCENE_ID) {
      if (zoneState.currentScheduleSceneId !== undefined) {
        scene = getItem(zoneState.currentScheduleSceneId, getScenes());
      }
    } else if (zoneState.currentSceneId !== undefined) {
      scene = getItem(zoneState.currentSceneId, getScenes());
    }
    const options: SetLightStateOptions = {
      zoneState,
      scene,
      lights: getLights(),
      patterns: getPatterns()
    };
    await Promise.allSettled([
      setRVLLightState(options),
      setPhilipsHueLightState(options),
      setLIFXLightState(options)
    ]);
  }
}
