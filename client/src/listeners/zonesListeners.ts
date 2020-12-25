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

import { CreateZoneRequest } from '../common/types';
import { createListener, dispatch } from '../reduxology';
import { ActionType } from '../types';
import { post, put, del } from '../util/api';

const createZoneListener = createListener(
  ActionType.CreateZone,
  async (name) => {
    const createBody: CreateZoneRequest = { name };
    try {
      const appState = await post('/api/zones', createBody);
      dispatch(ActionType.AppStateUpdated, appState);
    } catch {
      dispatch(ActionType.Notify, {
        severity: 'error',
        message: 'Failed to create zone'
      });
    }
  }
);

const editZoneListener = createListener(ActionType.EditZone, async (zone) => {
  try {
    const appState = await put(`/api/zone/${zone.id}`, zone);
    dispatch(ActionType.AppStateUpdated, appState);
  } catch {
    dispatch(ActionType.Notify, {
      severity: 'error',
      message: 'Failed to edit zone'
    });
  }
});

const deleteZoneListener = createListener(ActionType.DeleteZone, async (id) => {
  try {
    const appState = await del(`/api/zone/${id}`);
    dispatch(ActionType.AppStateUpdated, appState);
  } catch {
    dispatch(ActionType.Notify, {
      severity: 'error',
      message: 'Failed to delete zone'
    });
  }
});

export const zonesListeners = [
  createZoneListener,
  editZoneListener,
  deleteZoneListener
];
