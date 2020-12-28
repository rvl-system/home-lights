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
import { EditMode, Scene, SystemState, Zone } from '../../common/types';
import { getItem } from '../../common/util';
import { useContainerStyles } from '../lib/pageStyles';
import { CreateZoneButtonContainer } from './createZoneButtonContainer';
import { ZoneComponent, ZoneComponentDispatch } from './zoneComponent';

export interface ZonesTabProps {
  zones: Zone[];
  scenes: Scene[];
  state: SystemState;
}

export type ZonesTabDispatch = ZoneComponentDispatch;

export const ZonesTab: FunctionComponent<ZonesTabProps & ZonesTabDispatch> = (
  props
) => {
  const [editMode, setEditMode] = React.useState(EditMode.Operation);
  const classes = useContainerStyles();
  return (
    <div className={classes.container}>
      <Fade in={editMode === EditMode.Edit}>
        <div className={classes.altHeader}>
          <CreateZoneButtonContainer />
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
          {props.zones.map((zone) => {
            const state = getItem(zone.id, props.state.zoneStates, 'zoneId');
            const currentScene = props.scenes.find(
              (scene) => scene.id === state.currentSceneId
            );
            return (
              <ZoneComponent
                key={zone.id}
                zone={zone}
                state={state}
                editMode={editMode}
                deleteZone={props.deleteZone}
                setZonePower={props.setZonePower}
                setZoneBrightness={props.setZoneBrightness}
                currentScene={currentScene}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
