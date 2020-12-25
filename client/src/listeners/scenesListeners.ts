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

import { CreateSceneRequest } from '../common/types';
import { createListener, dispatch } from '../reduxology';
import { ActionType } from '../types';
import { del, post, put } from '../util/api';

const createScenesListener = createListener(
  ActionType.CreateScene,
  async ({ zoneId, name, lights }) => {
    const createBody: CreateSceneRequest = {
      name,
      zoneId,
      lights
    };
    try {
      const appState = await post('/api/scenes', createBody);
      dispatch(ActionType.AppStateUpdated, appState);
    } catch {
      dispatch(ActionType.Notify, {
        severity: 'error',
        message: 'Failed to create scene'
      });
    }
  }
);

const editSceneListener = createListener(
  ActionType.EditScene,
  async (scene) => {
    try {
      const appState = await put(`/api/scene/${scene.id}`, scene);
      dispatch(ActionType.AppStateUpdated, appState);
    } catch {
      dispatch(ActionType.Notify, {
        severity: 'error',
        message: 'Failed to edit scene'
      });
    }
  }
);

const deleteSceneListener = createListener(
  ActionType.DeleteScene,
  async (id) => {
    try {
      const appState = await del(`/api/scene/${id}`);
      dispatch(ActionType.AppStateUpdated, appState);
    } catch {
      dispatch(ActionType.Notify, {
        severity: 'error',
        message: 'Failed to delete scene'
      });
    }
  }
);

export const sceneListeners = [
  createScenesListener,
  editSceneListener,
  deleteSceneListener
];
