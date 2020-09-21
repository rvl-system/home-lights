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
import { Zones, ZonesProps, ZonesDispatch } from '../components/zone/zones';
import { StatePaths, Actions } from '../types';
import { Zone } from '../common/types';

export const ZonesContainer = createContainer(
  (getState): ZonesProps => {
    return {
      zones: getState(StatePaths.Zones)
    };
  },
  (dispatch): ZonesDispatch => ({
    createZone(name: string) {
      dispatch(Actions.CreateZone, name);
    },
    editZone(zone: Zone) {
      dispatch(Actions.EditZone, zone);
    },
    deleteZone(id: number) {
      dispatch(Actions.DeleteZone, id);
    },
    toggleZonePower(id: number, powerState: boolean) {
      console.log(`Toggling zone ${id} power to ${powerState}`);
      // TODO
    }
  }),
  Zones
);
