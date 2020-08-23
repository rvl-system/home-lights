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
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider
} from '@material-ui/core/styles';
import { FooterContainer } from '../containers/footer';
import { SelectedTab } from '../types';

import { RoomsContainer } from '../containers/rooms';
import { PatternsContainer } from '../containers/patterns';
import { LightsContainer } from '../containers/lights';

export interface AppProps {
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
    'flex-grow': 1
  }
});

export function App(props: AppProps): JSX.Element {
  const styles = useStyles();
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = createMuiTheme({
    palette: {
      // TODO: figure out why dark mode isn't propagating to everything
      type: isDarkMode && false ? 'dark' : 'light'
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.root}>
        <div className={styles.content}>
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
    </ThemeProvider>
  );
}
