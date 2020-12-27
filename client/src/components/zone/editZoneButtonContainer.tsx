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
  EditZoneButton,
  EditZoneButtonProps,
  EditZoneButtonDispatch
} from './editZoneButton';

export type EditZoneButtonContainerProps = Omit<
  EditZoneButtonProps,
  'zoneNames'
>;

export const EditZoneButtonContainer = createContainer(
  (getSlice, ownProps: EditZoneButtonContainerProps): EditZoneButtonProps => ({
    ...ownProps,
    unavailableZoneNames: getSlice(SliceName.Zones)
      .map((zone) => zone.name)
      .filter((zoneName) => zoneName !== ownProps.zone.name)
  }),
  (dispatch): EditZoneButtonDispatch => ({
    editZone(zone) {
      dispatch(ActionType.EditZone, zone);
    }
  }),
  EditZoneButton
);
