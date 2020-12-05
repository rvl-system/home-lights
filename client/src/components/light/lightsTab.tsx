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

import { Divider, List } from '@material-ui/core';
import React, { Fragment, FunctionComponent } from 'react';
import { Light, Zone } from '../../common/types';
import { CreateLightButtonContainer } from '../../containers/createLightButtonContainer';
import { useContainerStyles } from '../lib/pageStyles';
import { DeleteLightButtonDispatch } from './deleteLightButton';
import { LightComponent } from './lightComponent';

export interface LightsTabProps {
  lights: Light[];
  zones: Zone[];
}

export type LightsTabDispatch = DeleteLightButtonDispatch;

export const LightsTab: FunctionComponent<
  LightsTabProps & LightsTabDispatch
> = (props) => {
  const classes = useContainerStyles();
  return (
    <div className={classes.container}>
      <div className={classes.altHeader}>
        <CreateLightButtonContainer />
      </div>
      <div className={classes.content}>
        <div className={classes.innerContent}>
          <List>
            {props.lights.map((light) => (
              <Fragment key={light.id}>
                <Divider />
                <LightComponent
                  key={light.id}
                  light={light}
                  deleteLight={props.deleteLight}
                  zones={props.zones}
                />
              </Fragment>
            ))}
            <Divider />
          </List>
        </div>
      </div>
    </div>
  );
};
