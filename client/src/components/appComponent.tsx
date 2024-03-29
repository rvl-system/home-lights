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

import { useMediaQuery, CssBaseline } from '@material-ui/core';
import {
  makeStyles,
  createTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import { reduce } from 'conditional-reduce';
import React, { FunctionComponent, useMemo } from 'react';
import { FooterContainer } from './footerContainer';
import { LightsTabContainer } from './light/lightsTabContainer';
import { NotificationContainer } from './notificationContainer';
import { PatternsTabContainer } from './pattern/patternsTabContainer';
import { SettingsContainer } from './settings/settingsContainer';
import { ZonesTabContainer } from './zone/zonesTabContainer';
import { SelectedTab, Theme } from '../common/types';

export interface AppComponentProps {
  selectedTab: SelectedTab;
  connected: boolean;
  theme: Theme;
}

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    paddingBottom: '2px'
  },
  footer: {
    flexShrink: 0
  },
  connecting: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.7,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export const AppComponent: FunctionComponent<AppComponentProps> = (props) => {
  let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  switch (props.theme) {
    case Theme.Light: {
      prefersDarkMode = false;
      break;
    }
    case Theme.Dark: {
      prefersDarkMode = true;
      break;
    }
  }
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light'
        }
      }),
    [prefersDarkMode]
  );

  const classes = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {!props.connected && (
        <div className={classes.connecting}>Connecting to server...</div>
      )}
      <div className={classes.root}>
        <div className={classes.content}>
          {reduce(props.selectedTab, {
            [SelectedTab.Zones]: () => <ZonesTabContainer />,
            [SelectedTab.Patterns]: () => <PatternsTabContainer />,
            [SelectedTab.Lights]: () => <LightsTabContainer />,
            [SelectedTab.Settings]: () => <SettingsContainer />
          })}
        </div>
        <div className={classes.footer}>
          <FooterContainer />
        </div>
      </div>
      <NotificationContainer />
    </MuiThemeProvider>
  );
};
