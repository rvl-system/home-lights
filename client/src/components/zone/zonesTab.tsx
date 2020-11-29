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
import { Edit as EditIcon, Close as CloseIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { Zone } from '../../common/types';
import { EditMode } from '../../types';
import { useContainerStyles } from '../lib/pageStyles';
import { CreateZoneButton } from './createZoneButton';
import { ZoneComponent } from './zoneComponent';

export interface ZonesTabProps {
  zones: Zone[];
}

export interface ZonesTabDispatch {
  createZone: (name: string) => void;
  editZone: (zone: Zone) => void;
  deleteZone: (id: number) => void;
  toggleZonePower: (id: number, powerState: boolean) => void;
}

export const ZonesTab: FunctionComponent<ZonesTabProps & ZonesTabDispatch> = (
  props
) => {
  const [editMode, setEditMode] = React.useState(EditMode.Operation);
  const classes = useContainerStyles();
  return (
    <div className={classes.container}>
      <Fade in={editMode === EditMode.Edit}>
        <div className={classes.altHeader}>
          <CreateZoneButton createZone={props.createZone} />
        </div>
      </Fade>
      <Fade in={editMode === EditMode.Operation} mountOnEnter unmountOnExit>
        <Button
          className={classes.header}
          variant="outlined"
          onClick={() => setEditMode(EditMode.Edit)}
        >
          <EditIcon />
        </Button>
      </Fade>
      <Fade in={editMode === EditMode.Edit} mountOnEnter unmountOnExit>
        <Button
          className={classes.header}
          variant="outlined"
          onClick={() => setEditMode(EditMode.Operation)}
        >
          <CloseIcon />
        </Button>
      </Fade>

      <div className={classes.content}>
        <div className={classes.innerContent}>
          {props.zones.map((zone) => (
            <ZoneComponent
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
