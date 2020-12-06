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

import { Zone } from '../common/types';
import {
  ZoneScenesComponent,
  ZoneScenesComponentProps,
  ZoneScenesComponentDispatch
} from '../components/scene/zoneScenesComponent';
import { createContainer } from '../reduxology';
import { SliceName, ActionType, EditMode } from '../types';

export interface ZoneScenesContainerProps {
  zone: Zone;
  editMode: EditMode;
}

export const ZoneScenesContainer = createContainer(
  (getState, ownProps: ZoneScenesContainerProps): ZoneScenesComponentProps => ({
    zone: ownProps.zone,
    zoneScenes: getState(SliceName.Scenes).filter(
      (scene) => scene.zoneId === ownProps.zone.id
    ),
    zoneLights: [],
    editMode: ownProps.editMode
  }),
  (dispatch): ZoneScenesComponentDispatch => ({
    editScene(scene) {
      dispatch(ActionType.EditScene, scene);
    },
    deleteScene(id) {
      dispatch(ActionType.DeleteScene, id);
    }
  }),
  ZoneScenesComponent
);
