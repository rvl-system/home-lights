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

import { ActionType } from '../common/actions';
import { Settings } from '../common/types';
import { createReducer } from '../reduxology';
import { SliceName } from '../types';

// Typing this return type explicitly is very hard, but can be inferred easily
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createConnectionReducers(initialSettings: Settings) {
  const settingsReducer = createReducer(SliceName.Settings, initialSettings);

  settingsReducer.handle(
    ActionType.AppStateUpdated,
    (state, { settings }) => settings
  );

  return settingsReducer;
}
