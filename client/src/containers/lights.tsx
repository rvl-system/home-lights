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

import { createContainer } from 'reduxology';
import {
  Lights,
  LightsDispatch,
  LightsProps
} from '../components/light/lights';
import { StatePaths, Actions } from '../types';
import { Light } from '../common/types';

export const LightsContainer = createContainer(
  (getState): LightsProps => ({
    lights: getState(StatePaths.Lights)
  }),
  (dispatch): LightsDispatch => ({
    createRVLLight(name: string, channel: number) {
      dispatch(Actions.CreateRVLLight, name, channel);
    },
    createPhilipsHueLight(name: string) {
      dispatch(Actions.CreateHueLight, name);
    },
    editLight(light: Light) {
      dispatch(Actions.EditLight, light);
    },
    deleteLight(id: number) {
      dispatch(Actions.DeleteLight, id);
    }
  }),
  Lights
);
