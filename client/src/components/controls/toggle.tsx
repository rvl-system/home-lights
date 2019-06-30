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

export interface IToggleProps {
  label: string;
  initialValue: boolean;
  onChange: (newValue: boolean) => void;
}

interface IToggleState {
  value: boolean;
}

export class Toggle extends React.Component<IToggleProps, IToggleState> {

  public state = {
    value: this.props.initialValue
  };

  public render() {
    return (
      <div onClick={this.onClick}>
        <label>{this.props.label}:</label>
        <input
          type="range"
          min="0"
          max="1"
          value={this.state.value ? 1 : 0} />
      </div>
    );
  }

  private onClick = () => {
    this.updateValue(!this.state.value);
  }

  private updateValue(value: boolean) {
    this.setState((previousState) => {
      const newState: IToggleState = {
        ...previousState,
        value
      };
      setTimeout(() => this.props.onChange(value));
      return newState;
    });
  }
}
