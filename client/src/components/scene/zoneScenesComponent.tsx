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
import { Light, Scene, SceneLightEntry, Zone } from '../../common/types';
import { SceneComponent, SceneComponentDispatch } from './sceneComponent';

export interface ZoneScenesComponentProps {
  zone: Zone;
  zoneScenes: Scene[];
  zoneLights: Light[];
}

export interface ZoneScenesComponentDispatch extends SceneComponentDispatch {
  createScene: (name: string, lights: SceneLightEntry[]) => void;
}

export const ZoneScenesComponent: FunctionComponent<
  ZoneScenesComponentProps & ZoneScenesComponentDispatch
> = (props) => {
  return (
    <div>
      {props.zone.name} scenes
      <div>
        {props.zoneScenes.map((scene) => (
          <SceneComponent
            key={scene.id}
            scene={scene}
            editScene={props.editScene}
            deleteScene={props.deleteScene}
          />
        ))}
      </div>
    </div>
  );
};
