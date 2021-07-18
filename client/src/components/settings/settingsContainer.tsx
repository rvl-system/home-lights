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

import { ActionType } from '../../common/actions';
import { createContainer } from '../../reduxology';
import { SliceName } from '../../types';
import {
  settingsComponent,
  SettingsComponentDispatch,
  SettingsComponentProps
} from './settingsComponent';

export const SettingsContainer = createContainer(
  (getSlice): SettingsComponentProps => {
    return {
      theme: getSlice(SliceName.Settings).theme,
      philipsHueBridgeIp: getSlice(SliceName.SystemState).philipsHueBridgeIp,
      rvlInfo: getSlice(SliceName.SystemState).rvlInfo
    };
  },
  (dispatch): SettingsComponentDispatch => ({
    setTheme(theme) {
      dispatch(ActionType.SetTheme, theme);
    },
    connectPhilipsHueBridge() {
      dispatch(ActionType.ConnectPhilipsHueBridge);
    },
    refreshPhilipsHueLights() {
      dispatch(ActionType.RefreshPhilipsHueLights);
    },
    refreshLIFXLights() {
      dispatch(ActionType.RefreshLIFXLights);
    },
    setRVLInterface(networkInterface) {
      dispatch(ActionType.SetRVLInterface, { networkInterface });
    }
  }),
  settingsComponent
);
