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
import { makeStyles } from '@material-ui/core/styles';
import React, { Fragment, FunctionComponent } from 'react';
import { SCHEDULE_SCENE_ID } from '../../common/config';
import { EditMode, Light, Scene, Zone, ZoneState } from '../../common/types';
import { ZoneScheduleContainer } from '../schedule/zoneScheduleContainer';
import { CreateSceneButtonContainer } from './createSceneButtonContainer';
import { SceneComponent, SceneComponentDispatch } from './sceneComponent';

export interface ZoneScenesComponentProps {
  zone: Zone;
  zoneScenes: Scene[];
  zoneLights: Light[];
  editMode: EditMode;
  state: ZoneState;
}

export type ZoneScenesComponentDispatch = SceneComponentDispatch;

const useStyles = makeStyles(() => ({
  container: {
    'padding-right': '20px'
  },
  root: {
    width: '100%'
  }
}));

export const ZoneScenesComponent: FunctionComponent<
  ZoneScenesComponentProps & ZoneScenesComponentDispatch
> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <List className={classes.root}>
        <ZoneScheduleContainer
          zone={props.zone}
          editMode={props.editMode}
          selected={props.state.currentSceneId === SCHEDULE_SCENE_ID}
        />
        {props.zoneScenes.map((scene) => (
          <Fragment key={scene.id}>
            <Divider />
            <SceneComponent
              scene={scene}
              editMode={props.editMode}
              setZoneScene={props.setZoneScene}
              deleteScene={props.deleteScene}
              selected={props.state.currentSceneId === scene.id}
            />
          </Fragment>
        ))}
        <Divider />
      </List>
      {props.editMode === EditMode.Edit && (
        <CreateSceneButtonContainer zoneId={props.zone.id} />
      )}
    </div>
  );
};
