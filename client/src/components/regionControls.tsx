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
import { request } from '../message';

interface IRegionControlState {
  power: boolean;
}

export class RegionControl extends React.Component<{}, IRegionControlState> {

  public state = {
    power: false
  };

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
          max={16}
          onChange={this.onBrightnessChanged}
          />
      </div>
    );
  }

  private onPowerChanged = (power: boolean) => {
    request({
      endpoint: 'power',
      method: 'POST',
      body: { power }
    });
  }

  private onBrightnessChanged = (brightness: number) => {
    request({
      endpoint: 'brightness',
      method: 'POST',
      body: { brightness }
    });
  }
}
