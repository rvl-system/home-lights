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

import { Scene } from '../common/types';
import {
  SceneDialog,
  SceneDialogProps,
  SceneDialogDispatch
} from '../components/scene/sceneDialog';
import { createContainer } from '../reduxology';
import { SliceName } from '../types';

export interface SceneDialogContainerProps {
  scene?: Scene;
  zoneId: number;
  className: string;
}

export type SceneDialogContainerDispatch = SceneDialogDispatch;

export const SceneDialogContainer = createContainer(
  (getState, ownProps: SceneDialogContainerProps): SceneDialogProps => ({
    scene: ownProps.scene,
    zoneId: ownProps.zoneId,
    className: ownProps.className,
    lights: getState(SliceName.Lights).filter(
      (light) => light.zoneId === ownProps.zoneId
    ),
    patterns: getState(SliceName.Patterns)
  }),
  (dispatch, ownProps: SceneDialogContainerDispatch): SceneDialogDispatch => ({
    onConfirm: ownProps.onConfirm
  }),
  SceneDialog
);
