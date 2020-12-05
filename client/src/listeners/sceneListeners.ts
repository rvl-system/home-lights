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

import { Scene } from '../common/types';
import { createListener, dispatch } from '../reduxology';
import { ActionType } from '../types';
import { get, del } from '../util/api';

const deleteSceneListener = createListener(
  ActionType.DeleteScene,
  async (id: number) => {
    await del(`/api/scene/${id}`);

    const updatedScenes = (await get('/api/scenes')) as Scene[];
    dispatch(ActionType.ScenesUpdated, updatedScenes);
  }
);

export const sceneListeners = [deleteSceneListener];