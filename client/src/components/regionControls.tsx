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
import { Range } from './controls/range';
import { Toggle } from './controls/toggle';

interface IRegionControlState {
  power: boolean;
}

export class RegionControl extends React.Component<{}, IRegionControlState> {

  public state = {
    power: false
  };

  // private updateRate = (event: React.FormEvent<HTMLInputElement>) => {
  //   const rate = parseInt(event.currentTarget.value, 10);
  //   if (isNaN(rate)) {
  //     return;
  //   }
  //   this.updateColor();
  //   this.setState((previousState) => {
  //     const newState: IRegionControlState = {
  //       ...previousState,
  //       rate
  //     };
  //     return newState;
  //   });
  // }

  public render() {
    return (
      <div className="regionControl">
        <Toggle
          label="Power"
          initialValue={false}
          onChange={this.onPowerChanged}
          />
        <Range
          label="Brightness"
          initialValue={0}
          min={0}
          max={32}
          onChange={this.onBrightnessChanged}
          />
      </div>
    );
  }

  private updateColor() {
    console.log('updating color');
    // TODO
  }

  private onPowerChanged = (value: boolean) => {
    this.updateColor();
  }

  private onBrightnessChanged = (value: number) => {
    this.updateColor();
  }

  // private onPowerToggled = (event: React.FormEvent<HTMLInputElement>) => {
  //   const power = event.currentTarget.checked;
  //   this.updateColor();
  //   this.setState((previousState) => {
  //     const newState: IRegionControlState = {
  //       ...previousState,
  //       power
  //     };
  //     return newState;
  //   });
  // }
}
