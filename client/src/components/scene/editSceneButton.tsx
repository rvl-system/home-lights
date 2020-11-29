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

import { Button, Fade } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { Scene } from '../../common/types';
import { EditMode } from '../../types';

export interface EditSceneButtonProps {
  scene: Scene;
  editMode: EditMode;
  className: string;
}

export interface EditSceneButtonDispatch {
  editScene: (scene: Scene) => void;
}

export const EditSceneButton: FunctionComponent<
  EditSceneButtonProps & EditSceneButtonDispatch
> = (props) => {
  return (
    <React.Fragment>
      <Fade in={props.editMode === EditMode.Edit} mountOnEnter unmountOnExit>
        <Button
          className={props.className}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Edit scene');
          }}
        >
          <EditIcon />
        </Button>
      </Fade>
    </React.Fragment>
  );
};