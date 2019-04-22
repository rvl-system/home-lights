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
import { IWaveParameters } from 'rvl-node';
import { hex } from 'color-convert';
import { updateAnimation } from '../message';
import { Source } from '../message';

import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

enum AnimationType {
  Solid = 0
}

export interface ITVComponentState {
  animationType: AnimationType;
}

class TVSolidColorComponent extends React.Component<{}, {}> {

  public onColorChanged = (event: React.ChangeEvent) => {
    const hsv = hex.hsv((event.target as HTMLInputElement).value);
    const animationParameters: IWaveParameters = {
      waves: [{
        h: {
          b: Math.round(hsv[0] * 255 / 360),
          a: 0,
          w_t: 0,
          w_x: 0,
          phi: 0
        },
        s: {
          b: Math.round(hsv[1] * 255 / 100),
          a: 0,
          w_t: 0,
          w_x: 0,
          phi: 0
        },
        v: {
          b: Math.round(hsv[2] * 255 / 100),
          a: 0,
          w_t: 0,
          w_x: 0,
          phi: 0
        },
        a: {
          b: 255,
          a: 0,
          w_t: 0,
          w_x: 0,
          phi: 0
        }
      }]
    };
    updateAnimation(Source.TV, animationParameters);
  }

  public render() {
    return (
      <div>
        <div className="colorPickerContainer">
          <label>Color: </label>
          <input type="color" className="colorPicker" onChange={this.onColorChanged}></input>
        </div>
      </div>
    );
  }
}

export class TVComponent extends React.Component<{}, ITVComponentState> {

  public state: ITVComponentState = {
    animationType: AnimationType.Solid
  };

  public handleChange = (event: any) => {
    this.setState({ animationType: event.target.value });
  }

  public render() {
    let configurationComponent: JSX.Element | undefined;
    switch (this.state.animationType) {
      case AnimationType.Solid:
        configurationComponent = <TVSolidColorComponent />;
        break;
    }
    return (
      <div>
        <div>
          <FormControl variant="filled" fullWidth={true}>
            <InputLabel htmlFor="filled-animation-simple">Animation</InputLabel>
            <Select
              value={this.state.animationType}
              onChange={this.handleChange}
              input={<FilledInput name="Animation" id="filled-animation-simple" />}
            >
              <MenuItem value={AnimationType.Solid}>{AnimationType[AnimationType.Solid]}</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          {configurationComponent}
        </div>
      </div>
    );
  }
}
