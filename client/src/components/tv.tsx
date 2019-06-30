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
import { SolidAnimationComponent } from './animations/solid';
import { CycleAnimationComponent } from './animations/cycle';
import { RegionControl } from './regionControls';

enum AnimationType {
  Solid = 0,
  Cycle = 1
}

export interface ITVComponentState {
  animationType: AnimationType;
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
        configurationComponent = <SolidAnimationComponent />;
        break;
      case AnimationType.Cycle:
        configurationComponent = <CycleAnimationComponent />;
        break;
    }
    return (
      <div>
        <div>
          <RegionControl />
          <label>Animation:</label>
          {/* <Select
            value={this.state.animationType}
            onChange={this.handleChange}
            input={<FilledInput name="Animation" id="filled-animation-simple" />}
          >
            <MenuItem value={AnimationType.Solid}>{AnimationType[AnimationType.Solid]}</MenuItem>
            <MenuItem value={AnimationType.Cycle}>{AnimationType[AnimationType.Cycle]}</MenuItem>
          </Select> */}
        </div>
        <div>
          {configurationComponent}
        </div>
      </div>
    );
  }
}
