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
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

enum AnimationType {
  Solid = 0,
  DualColor = 1
}

export interface ITVComponentState {
  animationType: AnimationType;
}

export class TVComponent extends React.Component<{}, ITVComponentState> {

  public state: ITVComponentState = {
    animationType: AnimationType.Solid
  };

  public handleChange = (event: any) => {
    console.log(event.target.value);
    this.setState({ animationType: event.target.value });
  }

  public render() {
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
              <MenuItem value={AnimationType.DualColor}>{AnimationType[AnimationType.DualColor]}</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    );
  }
}
