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
import { EditScheduleButtonContainer } from './editScheduleButtonContainer';

const useStyles = makeStyles({
  caption: {
    paddingLeft: '15px'
  }
});

export interface ZoneScheduleComponentProps {
  schedule: Schedule;
  selected: boolean;
  currentlyActiveScene: Scene | undefined;
  editMode: EditMode;
}

export interface ZoneScheduleComponentDispatch {
  enableSchedule: () => void;
}

interface InternalProps {
  schedule: Schedule;
  selected: boolean;
  currentlyActiveScene: Scene | undefined;
}

const Subtitle: FunctionComponent<InternalProps> = (props) => {
  if (props.schedule.entries.length === 0) {
    return <em>No schedule created</em>;
  } else if (!props.selected) {
    return <em>Schedule not running</em>;
  } else if (props.currentlyActiveScene) {
    return <>{props.currentlyActiveScene.name}</>;
  } else {
    return <>Off</>;
  }
};

const EditZoneScheduleComponent: FunctionComponent<InternalProps> = (props) => {
  const classes = useStyles();
  const contentClasses = useContentStyles();
  return (
    <ListItem className={contentClasses.listItem}>
      <div>
        <Typography className={contentClasses.itemTitle}>Schedule</Typography>
        <Typography variant="caption" className={classes.caption}>
          <Subtitle {...props} />
        </Typography>
      </div>
      <EditScheduleButtonContainer schedule={props.schedule} />
    </ListItem>
  );
};

const OperationZoneScheduleComponent: FunctionComponent<
  InternalProps & ZoneScheduleComponentDispatch
> = (props) => {
  const classes = useStyles();
  const contentClasses = useContentStyles();
  return (
    <ListItem
      className={contentClasses.listItem}
      button
      selected={props.selected}
      onClick={() => props.enableSchedule()}
    >
      <div>
        <Typography className={contentClasses.itemTitle}>Schedule</Typography>
        <Typography variant="caption" className={classes.caption}>
          <Subtitle {...props} />
        </Typography>
      </div>
    </ListItem>
  );
};

export const ZoneScheduleComponent: FunctionComponent<
  ZoneScheduleComponentProps & ZoneScheduleComponentDispatch
> = (props) => {
  return props.editMode === EditMode.Edit ? (
    <EditZoneScheduleComponent
      schedule={props.schedule}
      selected={props.selected}
      currentlyActiveScene={props.currentlyActiveScene}
    />
  ) : (
    <OperationZoneScheduleComponent
      schedule={props.schedule}
      selected={props.selected}
      currentlyActiveScene={props.currentlyActiveScene}
      enableSchedule={props.enableSchedule}
    />
  );
};
