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

import { createContainer } from '../reduxology';
import {
  ZonesTab,
  ZonesTabProps,
  ZonesTabDispatch
} from '../components/zone/zonesTab';
import { SliceName, ActionType } from '../types';

export const ZonesTabContainer = createContainer(
  (getState): ZonesTabProps => ({
    zones: getState(SliceName.Zones)
  }),
  (dispatch): ZonesTabDispatch => ({
    createZone(name) {
      dispatch(ActionType.CreateZone, name);
    },
    editZone(zone) {
      dispatch(ActionType.EditZone, zone);
    },
    deleteZone(id) {
      dispatch(ActionType.DeleteZone, id);
    },
    toggleZonePower(id, powerState) {
      console.log(`Toggling zone ${id} power to ${powerState}`);
      // TODO
    }
  }),
  ZonesTab
);
