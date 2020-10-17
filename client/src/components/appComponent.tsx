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

import React, { FunctionComponent } from 'react';
import { reduce } from 'conditional-reduce';
import { useMediaQuery, CssBaseline } from '@material-ui/core';
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import { FooterContainer } from '../containers/footerContainer';
import { SelectedTab } from '../types';

import { ZonesTabContainer } from '../containers/zonesTabContainer';
import { PatternsTabContainer } from '../containers/patternsTabContainer';
import { LightsTabContainer } from '../containers/lightsTabContainer';

export interface AppComponentProps {
  activeTab: SelectedTab;
}

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    'flex-direction': 'column'
  },
  content: {
    'flex-grow': 1,
    'flex-shrink': 0,
    'flex-basis': 0,
    'padding-bottom': '2px'
  },
  footer: {
    'flex-shrink': 0
  }
});

export const AppComponent: FunctionComponent<AppComponentProps> = (props) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createMuiTheme({
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
      <div className={classes.root}>
        <div className={classes.content}>
          {reduce(props.activeTab, {
            [SelectedTab.Zones]: () => <ZonesTabContainer />,
            [SelectedTab.Patterns]: () => <PatternsTabContainer />,
            [SelectedTab.Lights]: () => <LightsTabContainer />
          })}
        </div>
        <div className={classes.footer}>
          <FooterContainer />
        </div>
      </div>
    </MuiThemeProvider>
  );
};
