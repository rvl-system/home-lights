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
import { EditMode, Scene, Schedule } from '../../common/types';
import { useContentStyles } from '../lib/pageStyles';

const useStyles = makeStyles({
  caption: {
    'padding-left': '15px'
  }
});

export interface ZoneScheduleComponentProps {
  schedule: Schedule;
  selected: boolean;
  currentlyActiveScene: Scene | undefined;
  editMode: EditMode;
}

export const ZoneScheduleComponent: FunctionComponent<ZoneScheduleComponentProps> = (
  props
) => {
  const classes = useStyles();
  const contentClasses = useContentStyles();
  let status: JSX.Element;
  if (props.schedule.entries.length === 0) {
    status = <em>No schedule created</em>;
  } else if (!props.selected) {
    status = <em>Schedule not running</em>;
  } else if (props.currentlyActiveScene) {
    status = <>{props.currentlyActiveScene.name}</>;
  } else {
    status = <>Off</>;
  }
  return (
    <ListItem
      className={contentClasses.listItem}
      button
      selected={props.selected}
    >
      <div>
        <Typography className={contentClasses.itemTitle}>Schedule</Typography>
        <Typography variant="caption" className={classes.caption}>
          {status}
        </Typography>
      </div>
    </ListItem>
  );
};
