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

import {
  BottomNavigation,
  BottomNavigationAction,
  makeStyles
} from '@material-ui/core';
import {
  Home as HomeIcon,
  BlurLinear as BlurLinearIcon,
  EmojiObjects as EmojiObjectsIcon
} from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { SelectedTab } from '../common/types';

export interface FooterComponentProps {
  activeTab: SelectedTab;
}

export interface FooterComponentDispatch {
  selectTab(newTab: SelectedTab): void;
}

// So this stuff is kinda funny. In iOS in standalone mode, the web page overlaps
// with the bottom menu bar, making tabs difficult to use, so we add extra
// padding to account for this, but not in non-standalone mode
const useStyles = makeStyles((theme) => ({
  container: {
    // I wonder why the TypeScript definitions don't recognize "standalone"?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddingBottom: (window.navigator as any).standalone ? '20px' : 'inherit',
    backgroundColor: theme.palette.background.paper
  }
}));

export const FooterComponent: FunctionComponent<
  FooterComponentProps & FooterComponentDispatch
> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <BottomNavigation
        value={props.activeTab}
        onChange={(event, newValue) => props.selectTab(newValue)}
        showLabels
      >
        <BottomNavigationAction
          label={SelectedTab.Zones}
          value={SelectedTab.Zones}
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label={SelectedTab.Patterns}
          value={SelectedTab.Patterns}
          icon={<BlurLinearIcon />}
        />
        <BottomNavigationAction
          label={SelectedTab.Lights}
          value={SelectedTab.Lights}
          icon={<EmojiObjectsIcon />}
        />
      </BottomNavigation>
    </div>
  );
};
