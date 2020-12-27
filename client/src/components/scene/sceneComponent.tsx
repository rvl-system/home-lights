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

import { ListItem, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Scene } from '../../common/types';
import { EditMode } from '../../types';
import { useContentStyles } from '../lib/pageStyles';
import {
  DeleteSceneButton,
  DeleteSceneButtonDispatch
} from './deleteSceneButton';
import { EditSceneButtonContainer } from './editSceneButtonContainer';

export interface SceneComponentProps {
  scene: Scene;
  editMode: EditMode;
  selected: boolean;
}

export type SceneComponentDispatch = DeleteSceneButtonDispatch & {
  setZoneScene: (zoneId: number, sceneId: number) => void;
};

const EditSceneComponent: FunctionComponent<
  SceneComponentProps & SceneComponentDispatch
> = (props) => {
  const classes = useContentStyles();
  return (
    <ListItem className={classes.listItem}>
      <DeleteSceneButton
        scene={props.scene}
        editMode={props.editMode}
        className={classes.leftButton}
        deleteScene={props.deleteScene}
      />
      <Typography className={classes.itemTitle}>{props.scene.name}</Typography>
      <EditSceneButtonContainer scene={props.scene} />
    </ListItem>
  );
};

const OperationSceneComponent: FunctionComponent<
  SceneComponentProps & SceneComponentDispatch
> = (props) => {
  const classes = useContentStyles();
  return (
    <ListItem className={classes.listItem} button selected={props.selected}>
      <Typography
        className={classes.itemTitle}
        onClick={() => props.setZoneScene(props.scene.zoneId, props.scene.id)}
      >
        {props.scene.name}
      </Typography>
    </ListItem>
  );
};

export const SceneComponent: FunctionComponent<
  SceneComponentProps & SceneComponentDispatch
> = (props) => {
  return props.editMode === EditMode.Edit ? (
    <EditSceneComponent {...props} />
  ) : (
    <OperationSceneComponent {...props} />
  );
};
