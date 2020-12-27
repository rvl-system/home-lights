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
import { LightType, RVLLight } from '../../common/types';
import { createContainer } from '../../reduxology';
import { SliceName } from '../../types';
import {
  EditLightButton,
  EditLightButtonProps,
  EditLightButtonDispatch
} from './editLightButton';

export type EditLightButtonContainerProps = Omit<EditLightButtonProps, 'zones'>;

export const EditLightButtonContainer = createContainer(
  (
    getSlice,
    ownProps: EditLightButtonContainerProps
  ): EditLightButtonProps => ({
    ...ownProps,
    zones: getSlice(SliceName.Zones),
    unavailableLightNames: getSlice(SliceName.Lights)
      .map((light) => light.name)
      .filter((lightName) => lightName !== ownProps.light.name),
    unavailableRVLChannels: getSlice(SliceName.Lights)
      .filter(
        (light) =>
          light.type === LightType.RVL && light.id !== ownProps.light.id
      )
      .map((light) => (light as RVLLight).channel)
  }),
  (dispatch): EditLightButtonDispatch => ({
    editLight(light) {
      dispatch(ActionType.EditLight, light);
    }
  }),
  EditLightButton
);
