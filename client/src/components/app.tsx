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
import { RegionComponent } from './region';

interface IAppComponentState {
  selectedTab: Source;
}

export enum Source {
  TV = 0,
  Kitchen = 2
}

export class AppComponent extends React.Component<{}, IAppComponentState> {

  public state: IAppComponentState = {
    selectedTab: Source.TV
  };

  public render(): JSX.Element {
    let content: JSX.Element | undefined;
    switch (this.state.selectedTab) {
      case Source.TV:
        content = <RegionComponent />;
        break;
    }
    return (
      <div className="appContainer">

        <div className="appHeader">
          <h2>Belden Public Library Lighting</h2>
        </div>

        <div className="appContent">
          {content}
        </div>

        {/* <div className="appFooter">
          <AppBar position="relative">
            <Tabs variant="fullWidth" value={this.state.selectedTab} onChange={this.handleChange}>
              <Tab label={Source[Source.TV]} />
              <Tab label={Source[Source.Lamp]} />
              <Tab label={Source[Source.Kitchen]} />
            </Tabs>
          </AppBar>
        </div> */}

      </div>
    );
  }

  // private handleChange = (event: React.ChangeEvent<{}>, selectedTab: Source) => {
  //   this.setState({ selectedTab });
  // }
}
