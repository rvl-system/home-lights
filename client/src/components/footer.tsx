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
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { Home, BlurLinear, EmojiObjects } from '@material-ui/icons';
import { SelectedTab } from '../types';

export interface FooterComponentProps {
  activeTab: SelectedTab;
}

export interface FooterComponentDispatch {
  selectTab(newTab: SelectedTab): void;
}

export function Footer(
  props: FooterComponentProps & FooterComponentDispatch
): JSX.Element {
  return (
    <BottomNavigation
      value={props.activeTab}
      onChange={(event, newValue) => props.selectTab(newValue)}
      showLabels
    >
      <BottomNavigationAction
        label={SelectedTab.Rooms}
        value={SelectedTab.Rooms}
        icon={<Home />}
      />
      <BottomNavigationAction
        label={SelectedTab.Patterns}
        value={SelectedTab.Patterns}
        icon={<BlurLinear />}
      />
      <BottomNavigationAction
        label={SelectedTab.Lights}
        value={SelectedTab.Lights}
        icon={<EmojiObjects />}
      />
    </BottomNavigation>
  );
}
