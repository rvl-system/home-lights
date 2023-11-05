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
  ZoneScenesComponent,
  ZoneScenesComponentProps,
  ZoneScenesComponentDispatch
} from './zoneScenesComponent';
import { ActionType } from '../../common/actions';
import { EditMode, Zone } from '../../common/types';
import { getItem } from '../../common/util';
import { createContainer } from '../../reduxology';
import { SliceName } from '../../types';

export interface ZoneScenesContainerProps {
  zone: Zone;
  editMode: EditMode;
  onSceneSelected: () => void;
}

export const ZoneScenesContainer = createContainer(
  (getSlice, ownProps: ZoneScenesContainerProps): ZoneScenesComponentProps => {
    const state = getItem(
      ownProps.zone.id,
      getSlice(SliceName.SystemState).zoneStates,
      'zoneId'
    );
    return {
      zone: ownProps.zone,
      zoneScenes: getSlice(SliceName.Scenes).scenes.filter(
        (scene) => scene.zoneId === ownProps.zone.id
      ),
      zoneLights: [],
      editMode: ownProps.editMode,
      state
    };
  },
  (dispatch, ownProps): ZoneScenesComponentDispatch => ({
    deleteScene(id) {
      dispatch(ActionType.DeleteScene, { id });
    },
    setZoneScene(zoneId, sceneId) {
      dispatch(ActionType.SetZoneScene, { zoneId, sceneId });
    },
    onSceneSelected: ownProps.onSceneSelected
  }),
  ZoneScenesComponent
);
