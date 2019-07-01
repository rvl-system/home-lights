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

export interface ISelectProps {
  label: string;
  options: Array<{ label: string, value: string }>;
  initialValue: string;
  onChange: (newValue: string) => void;
}

interface ISelectState {
  value: string;
}

export class Select extends React.Component<ISelectProps, ISelectState> {

  public state = {
    value: this.props.initialValue
  };

  public render() {
    return (
      <div className="control">
        <label>{this.props.label}:</label>
        <select className="select" onChange={this.onValueChanged} defaultValue={this.props.initialValue}>
          {this.props.options.map((option, key) =>
            <option key={key} value={option.value}>
              {option.label}
            </option>
          )}
      </select>
      </div>
    );
  }

  private onValueChanged = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    this.setState((previousState) => {
      const newState: ISelectState = {
        ...previousState,
        value
      };
      setTimeout(() => this.props.onChange(value));
      return newState;
    });
  }
}
