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

export interface IWaveAnimationProps {
  onAnimationChanged: (animationType: Animation) => void;
}

export class WaveAnimation extends React.Component<IWaveAnimationProps, {}> {

  public render() {
    return (
      <div>
        <Range
          label="Rate"
          min={1}
          max={32}
          initialValue={store.animationParameters.wave.rate}
          onChange={this.updateRate}
          />
        <Range
          label="Wave Hue"
          min={1}
          max={255}
          initialValue={store.animationParameters.wave.waveHue}
          onChange={this.updateWaveHue}
          />
        <Range
          label="Foreground Hue"
          min={1}
          max={255}
          initialValue={store.animationParameters.wave.foregroundHue}
          onChange={this.updateForegroundHue}
          />
        <Range
          label="Background Hue"
          min={1}
          max={255}
          initialValue={store.animationParameters.wave.backgroundHue}
          onChange={this.updateBackgroundHue}
          />
      </div>
    );
  }

  private updateRate = (rate: number) => {
    store.animationParameters.wave.rate = rate;
    this.props.onAnimationChanged('Wave');
  }

  private updateWaveHue = (waveHue: number) => {
    store.animationParameters.wave.waveHue = waveHue;
    this.props.onAnimationChanged('Wave');
  }

  private updateForegroundHue = (foregroundHue: number) => {
    store.animationParameters.wave.foregroundHue = foregroundHue;
    this.props.onAnimationChanged('Wave');
  }

  private updateBackgroundHue = (backgroundHue: number) => {
    store.animationParameters.wave.backgroundHue = backgroundHue;
    this.props.onAnimationChanged('Wave');
  }
}
