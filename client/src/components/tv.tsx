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

import * as React from 'react';
import { SolidAnimationComponent } from './animations/solid';
import { CycleAnimationComponent } from './animations/cycle';
import { RegionControl } from './regionControls';
import { Select } from './controls/select';
import { store } from '../store';
import { request } from '../message';

export interface ITVComponentState {
  animationType: 'Solid' | 'Cycle';
}

export class TVComponent extends React.Component<{}, ITVComponentState> {

  public state: ITVComponentState = {
    animationType: store.animationType
  };

  public handleChange = (animationType: string) => {
    if (animationType !== 'Solid' && animationType !== 'Cycle') {
      console.warn(`Invalid animation type ${animationType}`);
      return;
    }
    store.animationType = animationType;
    this.setState({ animationType });
    switch (animationType) {
      case 'Solid':
        request({
          endpoint: 'solid-animation',
          method: 'POST',
          body: {
            hue: store.hue,
            saturation: store.saturation
          }
        });
        break;
      case 'Cycle':
        request({
          endpoint: 'cycle-animation',
          method: 'POST',
          body: {
            rate: store.rate
          }
        });
        break;
    }
  }

  public render() {
    let configurationComponent: JSX.Element | undefined;
    switch (this.state.animationType) {
      case 'Solid':
        configurationComponent = <SolidAnimationComponent />;
        break;
      case 'Cycle':
        configurationComponent = <CycleAnimationComponent />;
        break;
    }
    return (
      <div className="content">
        <RegionControl />
        <hr />
        <Select
          label="Animation"
          initialValue={this.state.animationType}
          options={[
            { value: 'Solid', label: 'Solid' },
            { value: 'Cycle', label: 'Cycle' }
          ]}
          onChange={this.handleChange}
          />
        {configurationComponent}
      </div>
    );
  }
}
