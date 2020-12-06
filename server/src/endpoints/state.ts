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

import { FastifyInstance } from 'fastify';
import {
  SetZoneSceneRequest,
  SetZoneBrightnessRequest,
  SetZonePowerRequest
} from '../common/types';
import {
  getSystemState,
  setZoneScene,
  setZonePower,
  setZoneBrightness
} from '../device';
import { getAppState, post } from './endpoint';

export function init(app: FastifyInstance): void {
  app.get('/api/app-state', async () => getAppState());

  app.get('/api/states', async () => getSystemState());

  app.post(
    '/api/state-scene',
    post(async (sceneRequest: SetZoneSceneRequest) => {
      await setZoneScene(sceneRequest.sceneId);
    })
  );

  app.post(
    '/api/state-power',
    post(async (powerRequest: SetZonePowerRequest) => {
      await setZonePower(powerRequest.zoneId, powerRequest.power);
    })
  );

  app.post(
    '/api/state-brightness',
    post(async (brightnessRequest: SetZoneBrightnessRequest) => {
      await setZoneBrightness(
        brightnessRequest.zoneId,
        brightnessRequest.brightness
      );
    })
  );
}
