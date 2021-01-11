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
import { Schedule } from '../../common/types';
import { getItem } from '../../common/util';
import { createContainer } from '../../reduxology';
import { SliceName } from '../../types';
import {
  EditSceneButton,
  EditScheduleButtonProps,
  EditScheduleButtonDispatch
} from './editScheduleButton';

export interface EditScheduleButtonContainerProps {
  schedule: Schedule;
}

export const EditScheduleButtonContainer = createContainer(
  (getSlice, ownProps: EditScheduleButtonProps): EditScheduleButtonProps => ({
    schedule: ownProps.schedule,
    scenes: getSlice(SliceName.Scenes).scenes.filter(
      (scene) => scene.zoneId === ownProps.schedule.zoneId
    ),
    zone: getItem(ownProps.schedule.zoneId, getSlice(SliceName.Zones))
  }),
  (dispatch): EditScheduleButtonDispatch => ({
    editSchedule(schedule) {
      dispatch(ActionType.EditSchedule, schedule);
    }
  }),
  EditSceneButton
);
