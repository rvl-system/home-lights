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
import { CommonParameters } from './commonParameters';
import { Select } from './controls/select';
import { store, Animation } from '../store';
import { request } from '../message';

import { RainbowAnimation } from './animations/rainbow';
import { PulseAnimation } from './animations/pulse';
import { WaveAnimation } from './animations/wave';
import { CycleAnimation } from './animations/cycle';
import { SolidAnimation } from './animations/solid';

export interface IRegionState {
  animationType: Animation;
}

export class Region extends React.Component<{}, IRegionState> {

  public state: IRegionState = {
    animationType: store.animationType
  };

  public handleChange = (animationType: Animation) => {
    if (animationType !== store.animationType) {
      store.animationType = animationType;
      this.setState({ animationType });
    }
    request({
      endpoint: 'animation',
      method: 'POST',
      body: store
    });
  }

  public render() {
    let configurationComponent: JSX.Element | undefined;
    switch (this.state.animationType) {
      case 'Rainbow':
        configurationComponent = <RainbowAnimation onAnimationChanged={this.handleChange} />;
        break;
      case 'Pulse':
        configurationComponent = <PulseAnimation onAnimationChanged={this.handleChange} />;
        break;
      case 'Wave':
        configurationComponent = <WaveAnimation onAnimationChanged={this.handleChange} />;
        break;
      case 'Color Cycle':
        configurationComponent = <CycleAnimation onAnimationChanged={this.handleChange} />;
        break;
      case 'Solid':
        configurationComponent = <SolidAnimation onAnimationChanged={this.handleChange} />;
        break;
    }
    return (
      <div className="content">
        <CommonParameters />
        <hr />
        <Select
          label="Animation"
          initialValue={this.state.animationType}
          options={[
            { value: 'Rainbow', label: 'Rainbow' },
            { value: 'Pulse', label: 'Pulse' },
            { value: 'Wave', label: 'Wave' },
            { value: 'Color Cycle', label: 'Color Cycle' },
            { value: 'Solid', label: 'Solid' }
          ]}
          onChange={this.handleChange as (newValue: string) => void}
          />
        {configurationComponent}
      </div>
    );
  }
}
