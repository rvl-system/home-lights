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
  SetZoneBrightnessRequest,
  SetZonePowerRequest,
  SetZoneSceneRequest
} from '../common/types';
import { getItem } from '../common/util';
import { createListener, dispatch } from '../reduxology';
import { ActionType, SliceName } from '../types';
import { post } from '../util/api';

const setZoneScene = createListener(
  ActionType.SetZoneScene,
  async ({ zoneId, sceneId }, getSlice) => {
    const state = getSlice(SliceName.State);
    const zoneState = getItem(zoneId, state.zoneStates, 'zoneId');
    if (!zoneState.power) {
      await setZonePowerListener({ zoneId, power: true });
    }
    const setZoneSceneBody: SetZoneSceneRequest = { sceneId };
    const appState = await post('/api/state-scene', setZoneSceneBody);
    dispatch(ActionType.AppStateUpdated, appState);
  }
);

const setZoneBrightness = createListener(
  ActionType.SetZoneBrightness,
  async ({ zoneId, brightness }) => {
    const setZoneBrightnessBody: SetZoneBrightnessRequest = {
      zoneId,
      brightness
    };
    const appState = await post('/api/state-brightness', setZoneBrightnessBody);
    dispatch(ActionType.AppStateUpdated, appState);
  }
);

async function setZonePowerListener({
  zoneId,
  power
}: {
  zoneId: number;
  power: boolean;
}) {
  const setZonePowerBody: SetZonePowerRequest = { zoneId, power };
  const appState = await post('/api/state-power', setZonePowerBody);
  dispatch(ActionType.AppStateUpdated, appState);
}

const setZonePower = createListener(
  ActionType.SetZonePower,
  setZonePowerListener
);

export const stateListeners = [setZoneScene, setZoneBrightness, setZonePower];
