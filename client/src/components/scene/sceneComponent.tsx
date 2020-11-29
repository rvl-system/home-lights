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

import { Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Scene } from '../../common/types';
import { EditMode } from '../../types';
import { useContentStyles } from '../lib/pageStyles';
import {
  DeleteSceneButton,
  DeleteSceneButtonDispatch
} from './deleteSceneButton';
import { EditSceneButton, EditSceneButtonDispatch } from './editSceneButton';

export interface SceneComponentProps {
  scene: Scene;
  editMode: EditMode;
}

export type SceneComponentDispatch = DeleteSceneButtonDispatch &
  EditSceneButtonDispatch;

export const SceneComponent: FunctionComponent<
  SceneComponentProps & SceneComponentDispatch
> = (props) => {
  const classes = useContentStyles();
  return (
    <div className={classes.itemHeading}>
      <DeleteSceneButton
        scene={props.scene}
        editMode={props.editMode}
        className={classes.leftButton}
        deleteScene={props.deleteScene}
      />
      <Typography className={classes.itemTitle}>{props.scene.name}</Typography>
      <EditSceneButton
        className={classes.rightAccordionButton}
        scene={props.scene}
        editMode={props.editMode}
        editScene={props.editScene}
      />
    </div>
  );
};
