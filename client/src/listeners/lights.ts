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

import { listen, dispatch } from 'reduxology';
import { Actions } from '../types';
import {
  CreateRVLLightRequest,
  CreateHueLightRequest,
  Light,
  LightType
} from '../common/types';
import { get, post, put, del } from '../util/api';

listen(Actions.CreateRVLLight, async (name: string, channel: number) => {
  const createBody: CreateRVLLightRequest = {
    type: LightType.RVL,
    name,
    channel
  };
  await post('/api/lights', createBody);

  const updatedLights = await get('/api/lights');
  dispatch(Actions.LightsUpdated, updatedLights);
});

listen(Actions.CreateHueLight, async (name: string) => {
  const createBody: CreateHueLightRequest = {
    type: LightType.Hue,
    name
  };
  await post('/api/lights', createBody);

  const updatedLights = await get('/api/lights');
  dispatch(Actions.LightsUpdated, updatedLights);
});

listen(Actions.EditLight, async (light: Light) => {
  await put(`/api/light/${light.id}`, light);

  const updatedLights = await get('/api/lights');
  dispatch(Actions.LightsUpdated, updatedLights);
});

listen(Actions.DeleteLight, async (id: number) => {
  await del(`/api/light/${id}`);

  const updatedLights = await get('/api/lights');
  dispatch(Actions.LightsUpdated, updatedLights);
});
