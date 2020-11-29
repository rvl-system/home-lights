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

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { SceneLightEntry } from '../../common/types';

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

export interface CreateSceneButtonDispatch {
  createScene: (name: string, lights: SceneLightEntry[]) => void;
}

// TODO: implement the modal in https://github.com/rvl-system/home-lights/issues/52
export const CreateSceneButton: FunctionComponent<CreateSceneButtonDispatch> = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        onClick={() => console.log('Create Scene')}
      >
        <AddIcon />
      </Button>
    </div>
  );
};
