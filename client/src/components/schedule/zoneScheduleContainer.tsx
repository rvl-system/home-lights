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
import { EditMode, Zone } from '../../common/types';
import { getItem } from '../../common/util';
import { createContainer } from '../../reduxology';
import { SliceName } from '../../types';
import {
  ZoneScheduleComponent,
  ZoneScheduleComponentDispatch,
  ZoneScheduleComponentProps
} from './zoneScheduleComponent';

export interface ZoneScheduleContainerProps {
  zone: Zone;
  editMode: EditMode;
  selected: boolean;
}

export const ZoneScheduleContainer = createContainer(
  (
    getSlice,
    ownProps: ZoneScheduleContainerProps
  ): ZoneScheduleComponentProps => {
    const schedule = getItem(
      ownProps.zone.id,
      getSlice(SliceName.Schedules),
      'zoneId'
    );
    const { currentScheduleSceneId } = getItem(
      ownProps.zone.id,
      getSlice(SliceName.SystemState).zoneStates,
      'zoneId'
    );
    const currentlyActiveScene =
      currentScheduleSceneId === undefined
        ? undefined
        : getItem(currentScheduleSceneId, getSlice(SliceName.Scenes).scenes);
    return {
      editMode: ownProps.editMode,
      selected: ownProps.selected,
      currentlyActiveScene,
      schedule
    };
  },
  (dispatch): ZoneScheduleComponentDispatch => ({
    enableSchedule(schedule) {
      dispatch(ActionType.EnableSchedule, schedule);
    }
  }),
  ZoneScheduleComponent
);
