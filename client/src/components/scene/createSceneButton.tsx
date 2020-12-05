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

import { makeStyles } from '@material-ui/core/styles';
import React, { FunctionComponent } from 'react';
import { CreateSceneRequest, SceneLightEntry } from '../../common/types';
import { SceneDialogContainer } from '../../containers/sceneDialogContainer';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  },
  button: {
    width: '100%'
  }
});

export interface CreateSceneButtonProps {
  zoneId: number;
}

export interface CreateSceneButtonDispatch {
  createScene: (name: string, lights: SceneLightEntry[]) => void;
}

export const CreateSceneButton: FunctionComponent<
  CreateSceneButtonProps & CreateSceneButtonDispatch
> = (props) => {
  const classes = useStyles();

  function onConfirm(scene: CreateSceneRequest) {
    props.createScene(scene.name, scene.lights);
  }

  return (
    <div className={classes.container}>
      <SceneDialogContainer
        className={classes.button}
        zoneId={props.zoneId}
        onConfirm={onConfirm}
      />
    </div>
  );
};
