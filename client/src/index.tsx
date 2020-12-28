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

import { render } from 'react-dom';
import { AppContainer } from './components/appContainer';
import { connect } from './connection';
import { listeners } from './listeners/listeners';
import { createLightsReducers } from './reducers/lightsReducer';
import { notificationsReducer } from './reducers/notificationsReducer';
import { createPatternsReducers } from './reducers/patternsReducer';
import { createScenesReducers } from './reducers/scenesReducer';
import { selectedTabReducer } from './reducers/selectedTabReducer';
import { createStateReducers } from './reducers/stateReducer';
import { createZonesReducers } from './reducers/zonesReducer';
import { createApp } from './reduxology';

async function run() {
  const appState = await connect();

  const app = createApp({
    container: AppContainer,
    listeners,
    reducers: [
      createZonesReducers(appState.zones),
      createScenesReducers(appState.scenes, appState.version),
      createPatternsReducers(appState.patterns),
      createLightsReducers(appState.lights),
      createStateReducers(appState.systemState),
      selectedTabReducer,
      notificationsReducer
    ]
  });

  render(app, document.getElementById('app'));
}
run();
