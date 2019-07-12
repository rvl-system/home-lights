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
import { reduce } from 'conditional-reduce';

export interface IRangeProps {
  label: string;
  initialValue: number;
  min: number;
  max: number;
  sliderStyle: 'hue' | 'saturation' | 'normal';
  onChange: (newValue: number) => void;
}

interface IRangeState {
  value: number;
}

const UPDATE_GATING_PERIOD = 250;

export class Range extends React.Component<IRangeProps, IRangeState> {

  private updatePending = false;

  public state = {
    value: this.props.initialValue
  };

  public render() {
    return (
      <div className="control">
        <label>{this.props.label}:</label>
        <input
          className={reduce(this.props.sliderStyle, {
            hue: () => 'range range-hue',
            saturation: () => 'range range-saturation',
            normal: () => 'range'
          })}
          type="range"
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          onChange={this.onValueChanged} />
      </div>
    );
  }

  private updateValue = () => {
    if (this.updatePending) {
      return;
    }
    this.updatePending = true;
    setTimeout(() => {
      this.props.onChange(this.state.value);
      this.updatePending = false;
    }, UPDATE_GATING_PERIOD);
  }

  private onValueChanged = (event: React.FormEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value, 10);
    if (isNaN(value)) {
      return;
    }
    this.setState((previousState) => {
      const newState: IRangeState = {
        ...previousState,
        value
      };
      this.updateValue();
      return newState;
    });
  }
}
