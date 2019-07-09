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
import { Range } from '../controls/range';
import { store, Animation } from '../../store';

export interface IPulseAnimationProps {
  onAnimationChanged: (animationType: Animation) => void;
}

export class PulseAnimation extends React.Component<IPulseAnimationProps, {}> {

  public render() {
    return (
      <div>
        <Range
          label="Rate"
          min={1}
          max={32}
          initialValue={store.animationParameters.pulse.rate}
          onChange={this.updateRate}
          />
        <Range
          label="Hue"
          min={1}
          max={255}
          initialValue={store.animationParameters.pulse.hue}
          onChange={this.updateHue}
          />
        <Range
          label="Saturation"
          min={1}
          max={255}
          initialValue={store.animationParameters.pulse.saturation}
          onChange={this.updateSaturation}
          />
      </div>
    );
  }

  private updateRate = (rate: number) => {
    store.animationParameters.pulse.rate = rate;
    this.props.onAnimationChanged('Pulse');
  }

  private updateHue = (hue: number) => {
    store.animationParameters.pulse.hue = hue;
    this.props.onAnimationChanged('Pulse');
  }

  private updateSaturation = (saturation: number) => {
    store.animationParameters.pulse.saturation = saturation;
    this.props.onAnimationChanged('Pulse');
  }
}
