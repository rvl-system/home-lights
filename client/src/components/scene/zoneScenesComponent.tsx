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

import { List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FunctionComponent } from 'react';
import { Light, Scene } from '../../common/types';
import { EditMode } from '../../types';
import {
  CreateSceneButton,
  CreateSceneButtonDispatch
} from './createSceneButton';
import { SceneComponent, SceneComponentDispatch } from './sceneComponent';

export interface ZoneScenesComponentProps {
  zoneScenes: Scene[];
  zoneLights: Light[];
  editMode: EditMode;
}

export type ZoneScenesComponentDispatch = SceneComponentDispatch &
  CreateSceneButtonDispatch;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%'
  }
}));

export const ZoneScenesComponent: FunctionComponent<
  ZoneScenesComponentProps & ZoneScenesComponentDispatch
> = (props) => {
  const classes = useStyles();
  return (
    <div>
      {props.editMode === EditMode.Edit && (
        <CreateSceneButton createScene={props.createScene} />
      )}
      <List className={classes.root}>
        {props.zoneScenes.map((scene) => (
          <ListItem key={scene.id}>
            <SceneComponent
              scene={scene}
              editMode={props.editMode}
              editScene={props.editScene}
              deleteScene={props.deleteScene}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};
