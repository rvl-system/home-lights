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

import { ListItem, makeStyles, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Scene, ScheduleEntry } from '../../common/types';
import { formatTime, getItem } from '../../common/util';
import { useContentStyles } from '../lib/pageStyles';
import {
  DeleteScheduleEntryButton,
  DeleteScheduleEntryButtonDispatch
} from './deleteScheduleEntryButton';
import {
  EditScheduleEntryButton,
  EditScheduleEntryButtonDispatch
} from './editScheduleEntryButton';

const useStyles = makeStyles({
  time: {
    display: 'inline-block',
    width: '50px'
  }
});

export interface CreateScheduleEntryButtonProps {
  scenes: Scene[];
  scheduleEntry: ScheduleEntry;
}

export type CreateScheduleEntryButtonDispatch = DeleteScheduleEntryButtonDispatch &
  EditScheduleEntryButtonDispatch;

export const ScheduleEntryComponent: FunctionComponent<
  CreateScheduleEntryButtonProps & CreateScheduleEntryButtonDispatch
> = (props) => {
  const classes = useStyles();
  const contentClasses = useContentStyles();
  return (
    <ListItem className={contentClasses.listItem}>
      <DeleteScheduleEntryButton
        className={contentClasses.leftButton}
        scheduleEntry={props.scheduleEntry}
        onDelete={props.onDelete}
      />
      <div>
        <Typography className={contentClasses.itemTitle}>
          <span className={classes.time}>
            {formatTime(props.scheduleEntry.hour, props.scheduleEntry.minute)}
          </span>
          {props.scheduleEntry.sceneId === undefined ? (
            <em>Off</em>
          ) : (
            getItem(props.scheduleEntry.sceneId, props.scenes).name
          )}
        </Typography>
      </div>
      <EditScheduleEntryButton
        scheduleEntry={props.scheduleEntry}
        scenes={props.scenes}
        className={contentClasses.rightButton}
        onEdit={props.onEdit}
      />
    </ListItem>
  );
  return (
    <div>
      {`${props.scheduleEntry.sceneId} ${props.scheduleEntry.hour} ${props.scheduleEntry.minute}`}
    </div>
  );
};
