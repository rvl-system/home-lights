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
import { Button, Fade } from '@material-ui/core';
import { Edit, Close } from '@material-ui/icons';
import { Zone as ZoneType } from '../../common/types';
import { EditMode } from '../../types';
import { CreateZoneButton } from './createZoneButton';
import { Zone } from './zone';
import { useContainerStyles } from '../lib/pageStyles';

export interface ZonesProps {
  zones: ZoneType[];
}

export interface ZonesDispatch {
  createZone: (name: string) => void;
  editZone: (zone: ZoneType) => void;
  deleteZone: (id: number) => void;
  toggleZonePower: (id: number, powerState: boolean) => void;
}

export const Zones: FunctionComponent<ZonesProps & ZonesDispatch> = (props) => {
  const [editMode, setEditMode] = React.useState(EditMode.view);
  const classes = useContainerStyles();
  return (
    <div className={classes.container}>
      <Fade in={editMode === EditMode.edit}>
        <div className={classes.altHeader}>
          <CreateZoneButton createZone={props.createZone} />
        </div>
      </Fade>
      <Fade in={editMode === EditMode.view} mountOnEnter unmountOnExit>
        <Button
          className={classes.header}
          variant="outlined"
          onClick={() => setEditMode(EditMode.edit)}
        >
          <Edit />
        </Button>
      </Fade>
      <Fade in={editMode === EditMode.edit} mountOnEnter unmountOnExit>
        <Button
          className={classes.header}
          variant="outlined"
          onClick={() => setEditMode(EditMode.view)}
        >
          <Close />
        </Button>
      </Fade>

      <div className={classes.content}>
        <div className={classes.innerContent}>
          {props.zones.map((zone) => (
            <Zone
              key={zone.id}
              zone={zone}
              editMode={editMode}
              editZone={props.editZone}
              deleteZone={props.deleteZone}
              toggleZonePower={props.toggleZonePower}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
