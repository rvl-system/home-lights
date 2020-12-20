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

import debounce from 'debounce';
import { createContainer } from '../../reduxology';
import { SliceName, ActionType } from '../../types';
import { ZonesTab, ZonesTabProps, ZonesTabDispatch } from './zonesTab';

export const ZonesTabContainer = createContainer(
  (getSlice): ZonesTabProps => ({
    zones: getSlice(SliceName.Zones),
    state: getSlice(SliceName.State),
    scenes: getSlice(SliceName.Scenes)
  }),
  (dispatch): ZonesTabDispatch => ({
    deleteZone(id) {
      dispatch(ActionType.DeleteZone, id);
    },
    setZonePower(zoneId, power) {
      dispatch(ActionType.SetZonePower, { zoneId, power });
    },
    setZoneBrightness: debounce((zoneId, brightness) => {
      dispatch(ActionType.SetZoneBrightness, { zoneId, brightness });
    }, 33)
  }),
  ZonesTab
);
