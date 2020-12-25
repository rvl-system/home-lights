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

import { createListener, dispatch } from '../reduxology';
import { ActionType } from '../types';
import { del } from '../util/api';

const deletePatternListener = createListener(
  ActionType.DeletePattern,
  async (id) => {
    try {
      const appState = await del(`/api/pattern/${id}`);
      dispatch(ActionType.AppStateUpdated, appState);
    } catch {
      dispatch(ActionType.Notify, {
        severity: 'error',
        message: 'Failed to delete pattern'
      });
    }
  }
);

export const patternsListeners = [deletePatternListener];
