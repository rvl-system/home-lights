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
import { FooterContainer } from '../containers/footer';
import { SelectedTab } from '../types';

import { RoomsContainer } from '../containers/rooms';
import { PatternsContainer } from '../containers/patterns';
import { LightsContainer } from '../containers/lights';

export interface AppProps {
  activeTab: SelectedTab;
}

export function App(props: AppProps): JSX.Element {
  return (
    <div className="app">
      <div className="content">
        {reduce(props.activeTab, {
          // eslint-disable-next-line react/display-name
          [SelectedTab.Rooms]: () => <RoomsContainer />,

          // eslint-disable-next-line react/display-name
          [SelectedTab.Patterns]: () => <PatternsContainer />,

          // eslint-disable-next-line react/display-name
          [SelectedTab.Lights]: () => <LightsContainer />
        })}
      </div>
      <FooterContainer />
    </div>
  );
}
