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

import { CreateRVLLightRequest, LightType } from '../common/types';
import { createListener, dispatch } from '../reduxology';
import { ActionType } from '../types';
import { post, put, del } from '../util/api';

const createRVLLightListener = createListener(
  ActionType.CreateRVLLight,
  async ({ name, channel, zoneId }) => {
    const createBody: CreateRVLLightRequest = {
      type: LightType.RVL,
      name,
      channel,
      zoneId
    };
    const appState = await post('/api/lights', createBody);
    dispatch(ActionType.AppStateUpdated, appState);
  }
);

const editLightListener = createListener(
  ActionType.EditLight,
  async (light) => {
    const appState = await put(`/api/light/${light.id}`, light);
    dispatch(ActionType.AppStateUpdated, appState);
  }
);

const deleteLightListener = createListener(
  ActionType.DeleteLight,
  async (id) => {
    const appState = await del(`/api/light/${id}`);
    dispatch(ActionType.AppStateUpdated, appState);
  }
);

export const lightsListeners = [
  createRVLLightListener,
  editLightListener,
  deleteLightListener
];
