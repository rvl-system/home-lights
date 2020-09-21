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

<<<<<<< HEAD
import React, { FunctionComponent } from 'react';
import { Typography } from '@material-ui/core';

export const Lights: FunctionComponent<null> = () => {
  return <Typography>Lights</Typography>;
};
=======
import * as React from 'react';
import {
  CreateLightButton,
  CreateLightButtonDispatch
} from './createLightButton';
import { useStyles } from '../lib/pageStyles';

export type LightsDispatch = CreateLightButtonDispatch;

export function Lights(props: LightsDispatch): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.altHeader}>
        <CreateLightButton
          createRVLLight={props.createRVLLight}
          createHueLight={props.createHueLight}
        />
      </div>
    </div>
  );
}
>>>>>>> Started wiring up lights
