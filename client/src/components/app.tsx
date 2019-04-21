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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

enum SelectedTab {
  TV = 0,
  Lamp = 1,
  Kitchen = 2
}

interface IAppComponentState {
  selectedTab: SelectedTab;
}

export class AppComponent extends React.Component<{}, IAppComponentState> {

  public state: IAppComponentState = {
    selectedTab: SelectedTab.TV
  };

  public render(): JSX.Element {
    return (
      <div className="appContainer">

        <div className="appHeader">
          <h2>Home Lights</h2>
        </div>

        <div className="appContent">
          Content
        </div>

        <div className="appFooter">
          <AppBar position="relative">
            <Tabs variant="fullWidth" value={this.state.selectedTab} onChange={this.handleChange}>
              <Tab label={SelectedTab[SelectedTab.TV]} />
              <Tab label={SelectedTab[SelectedTab.Lamp]} />
              <Tab label={SelectedTab[SelectedTab.Kitchen]} />
            </Tabs>
          </AppBar>
        </div>

      </div>
    );
  }

  private handleChange = (event: React.ChangeEvent<{}>, selectedTab: SelectedTab) => {
    this.setState({ selectedTab });
  }
}
