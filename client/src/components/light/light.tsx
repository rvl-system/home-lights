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
import { Typography } from '@material-ui/core';
import { Light as LightInterfaceType, LightType } from '../../common/types';
import { EditLightButton, EditLightButtonDispatch } from './editLightButton';
import {
  DeleteLightButton,
  DeleteLightButtonDispatch
} from './deleteLightButton';
import { useContentStyles } from '../lib/pageStyles';

export interface LightProps {
  light: LightInterfaceType;
}

export type LightDispatch = EditLightButtonDispatch & DeleteLightButtonDispatch;

export const Light: FunctionComponent<LightProps & LightDispatch> = (props) => {
  const classes = useContentStyles();
  const canEdit = props.light.type === LightType.RVL;
  return (
    <React.Fragment>
      <div className={classes.itemHeading}>
        {canEdit && (
          <DeleteLightButton
            light={props.light}
            className={classes.leftButton}
            deleteLight={props.deleteLight}
          />
        )}
        <Typography className={classes.itemTitle}>
          {props.light.name}
        </Typography>
        <EditLightButton
          className={classes.rightButton}
          light={props.light}
          editLight={props.editLight}
          canChangeName={canEdit}
        />
      </div>
    </React.Fragment>
  );
};
