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

import { ActionType } from './common/actions';
import { SystemState, Zone, ZoneState } from './common/types';
import { getItem } from './common/util';
import { getLights } from './db/lights';
import { getPatterns } from './db/patterns';
import { getScenes, setSceneBrightness } from './db/scenes';
import { getZones } from './db/zones';
import {
  init as initLIFX,
  setLightState as setLIFXLightState
} from './device/lifx';
import {
  init as initPhilipsHue,
  setLightState as setRVLLightState
} from './device/phillipsHue';
import {
  init as initRVL,
  setLightState as setPhilipsHueLightState
} from './device/rvl';
import { SetLightStateOptions } from './device/types';
import { ActionHandler } from './types';

const systemState: SystemState = {
  zoneStates: []
};

export async function init(): Promise<void> {
  await initRVL();
  await initPhilipsHue();
  await initLIFX();
  const zones = await getZones();
  for (const zone of zones) {
    systemState.zoneStates.push({
      zoneId: zone.id,
      currentSceneId: undefined,
      power: false
    });
  }
}

export function reconcile(zones: Zone[]): void {
  // Add any new zones to state that were created
  for (const zone of zones) {
    if (
      !systemState.zoneStates.find((zoneState) => zoneState.zoneId === zone.id)
    ) {
      systemState.zoneStates.push({
        zoneId: zone.id,
        currentSceneId: undefined,
        power: false
      });
    }
  }

  // Remove any zones from zone state that were deleted
  for (let i = systemState.zoneStates.length - 1; i >= 0; i--) {
    const zoneState = systemState.zoneStates[i];
    if (!zones.find((zone) => zone.id === zoneState.zoneId)) {
      systemState.zoneStates.splice(i, 1);
    }
  }

  // Update any patterns currently being displayed
  for (const zone of systemState.zoneStates) {
    if (zone.currentSceneId) {
      setZoneScene({
        zoneId: zone.zoneId,
        sceneId: zone.currentSceneId
      });
    }
  }
}

export function getSystemState(): SystemState {
  return systemState;
}

export const setZoneScene: ActionHandler<ActionType.SetZoneScene> = async (
  request
) => {
  const scene = getItem(request.sceneId, await getScenes());
  const zoneState = getItem(scene.zoneId, systemState.zoneStates, 'zoneId');
  if (!zoneState.power) {
    await setZonePower({
      zoneId: scene.zoneId,
      power: true
    });
  }
  zoneState.currentSceneId = request.sceneId;
  await setLightState(zoneState);
};

export const setZoneBrightness: ActionHandler<ActionType.SetZoneBrightness> = async (
  request
) => {
  const zoneState = getItem(request.zoneId, systemState.zoneStates, 'zoneId');
  if (zoneState.currentSceneId === undefined) {
    return;
  }
  await setSceneBrightness(zoneState.currentSceneId, request.brightness);
  setLightState(zoneState);
};

export const setZonePower: ActionHandler<ActionType.SetZonePower> = async (
  request
) => {
  const zoneState = getItem(request.zoneId, systemState.zoneStates, 'zoneId');
  zoneState.power = request.power;
  setLightState(zoneState);
};

async function setLightState(zoneState: ZoneState): Promise<void> {
  if (zoneState.currentSceneId === undefined) {
    return;
  }
  const [scene, lights, patterns] = await Promise.all([
    getItem(zoneState.currentSceneId, await getScenes()),
    getLights(),
    getPatterns()
  ]);
  const options: SetLightStateOptions = {
    zoneState,
    scene,
    lights,
    patterns
  };
  await Promise.allSettled([
    setRVLLightState(options),
    setPhilipsHueLightState(options),
    setLIFXLightState(options)
  ]);
}
