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
import { makeStyles } from '@material-ui/core/styles';
import React, { FunctionComponent } from 'react';
import {
  Light as LightInterfaceType,
  LightType,
  Zone
} from '../../common/types';
import { getItem } from '../../common/util';
import { useContentStyles } from '../lib/pageStyles';
import {
  DeleteLightButton,
  DeleteLightButtonDispatch
} from './deleteLightButton';
import { EditLightButtonContainer } from './editLightButtonContainer';

const styles = makeStyles({
  caption: {
    'padding-left': '15px'
  }
});

export interface LightComponentProps {
  light: LightInterfaceType;
  zones: Zone[];
}

export type LightComponentDispatch = DeleteLightButtonDispatch;

export const LightComponent: FunctionComponent<
  LightComponentProps & LightComponentDispatch
> = (props) => {
  const classes = styles();
  const contentClasses = useContentStyles();
  const canEdit = props.light.type === LightType.RVL;
  let zone: Zone | undefined;
  if (props.light.zoneId !== undefined) {
    zone = getItem(props.light.zoneId, props.zones);
  }
  return (
    <ListItem className={contentClasses.listItem}>
      {canEdit ? (
        <DeleteLightButton
          light={props.light}
          className={contentClasses.leftButton}
          deleteLight={props.deleteLight}
        />
      ) : (
        <div className={contentClasses.leftButton}></div>
      )}
      <div>
        <Typography className={contentClasses.itemTitle}>
          {props.light.name}
        </Typography>
        <Typography variant="caption" className={classes.caption}>
          {zone ? zone.name : <em>Unassigned</em>}
        </Typography>
      </div>
      <EditLightButtonContainer
        className={contentClasses.rightButton}
        light={props.light}
        canChangeName={canEdit}
      />
    </ListItem>
  );
};
