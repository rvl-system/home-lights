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
  EditSceneButton,
  EditSceneButtonProps,
  EditSceneButtonDispatch
} from './editSceneButton';
import { ActionType } from '../../common/actions';
import { Scene } from '../../common/types';
import { createContainer } from '../../reduxology';
import { SliceName } from '../../types';

export interface EditSceneButtonContainerProps {
  scene: Scene;
}

export const EditSceneButtonContainer = createContainer(
  (
    getSlice,
    ownProps: EditSceneButtonContainerProps
  ): EditSceneButtonProps => ({
    scene: ownProps.scene,
    patterns: getSlice(SliceName.Patterns),
    lights: getSlice(SliceName.Lights),
    unavailableSceneNames: getSlice(SliceName.Scenes)
      .scenes.filter(
        (scene) =>
          scene.zoneId === ownProps.scene.zoneId &&
          scene.id !== ownProps.scene.id
      )
      .map((scene) => scene.name)
  }),
  (dispatch): EditSceneButtonDispatch => ({
    editScene(scene) {
      dispatch(ActionType.EditScene, scene);
    }
  }),
  EditSceneButton
);
