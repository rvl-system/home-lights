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

import {
  CreateSceneButton,
  CreateSceneButtonProps,
  CreateSceneButtonDispatch
} from '../components/scene/createSceneButton';
import { createContainer } from '../reduxology';
import { ActionType, SliceName } from '../types';

export interface CreateSceneButtonContainerProps {
  zoneId: number;
}

export const CreateSceneButtonContainer = createContainer(
  (
    getState,
    ownProps: CreateSceneButtonContainerProps
  ): CreateSceneButtonProps => ({
    zoneId: ownProps.zoneId,
    lights: getState(SliceName.Lights).filter(
      (light) => light.zoneId === ownProps.zoneId
    ),
    patterns: getState(SliceName.Patterns)
  }),
  (
    dispatch,
    ownProps: CreateSceneButtonContainerProps
  ): CreateSceneButtonDispatch => ({
    createScene(name, lights) {
      dispatch(ActionType.CreateScene, {
        zoneId: ownProps.zoneId,
        name,
        lights
      });
    }
  }),
  CreateSceneButton
);
