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

import { CreateRVLLightRequest, Light, LightType } from '../common/types';
import { createListener, dispatch } from '../reduxology';
import { ActionType } from '../types';
import { get, post, put, del } from '../util/api';

const createRVLLightListener = createListener(
  ActionType.CreateRVLLight,
  async ({ name, channel, zoneId }) => {
    const createBody: CreateRVLLightRequest = {
      type: LightType.RVL,
      name,
      channel,
      zoneId
    };
    await post('/api/lights', createBody);

    const updatedLights = (await get('/api/lights')) as Light[];
    dispatch(ActionType.LightsUpdated, updatedLights);
  }
);

const editLightListener = createListener(
  ActionType.EditLight,
  async (light) => {
    await put(`/api/light/${light.id}`, light);

    const updatedLights = (await get('/api/lights')) as Light[];
    dispatch(ActionType.LightsUpdated, updatedLights);
  }
);

const deleteLightListener = createListener(
  ActionType.DeleteLight,
  async (id) => {
    await del(`/api/light/${id}`);

    const updatedLights = (await get('/api/lights')) as Light[];
    dispatch(ActionType.LightsUpdated, updatedLights);
  }
);

export const lightsListeners = [
  createRVLLightListener,
  editLightListener,
  deleteLightListener
];
