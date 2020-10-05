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

import React, { FunctionComponent } from 'react';
import { List, ListItem } from '@material-ui/core';
import {
  CreateLightButton,
  CreateLightButtonDispatch
} from './createLightButton';
import { EditLightButtonDispatch } from './editLightButton';
import { DeleteLightButtonDispatch } from './deleteLightButton';
import { useContainerStyles } from '../lib/pageStyles';
import { Light as LightType } from '../../common/types';
import { Light } from './light';

export interface LightsProps {
  lights: LightType[];
}

export type LightsDispatch = CreateLightButtonDispatch &
  EditLightButtonDispatch &
  DeleteLightButtonDispatch;

export const Lights: FunctionComponent<LightsProps & LightsDispatch> = (
  props
) => {
  const classes = useContainerStyles();
  return (
    <div className={classes.container}>
      <div className={classes.altHeader}>
        <CreateLightButton createRVLLight={props.createRVLLight} />
      </div>
      <div className={classes.content}>
        <div className={classes.innerContent}>
          <List component="nav">
            {props.lights.map((light) => (
              <ListItem key={light.id}>
                <Light
                  light={light}
                  editLight={props.editLight}
                  deleteLight={props.deleteLight}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
};
