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
import { Light, Zone, Pattern } from './common/types';
import { AppContainer } from './containers/appContainer';
import { listeners } from './listeners/listeners';
import { reducers } from './reducers/reducers';
import { createApp, dispatch } from './reduxology';
import { ActionType } from './types';
import { get } from './util/api';

async function run() {
  const app = createApp({
    container: AppContainer,
    listeners,
    reducers
  });

  render(app, document.getElementById('app'));

  get('/api/zones').then((zones) =>
    dispatch(ActionType.ZonesUpdated, zones as Zone[])
  );
  get('/api/lights').then((lights) =>
    dispatch(ActionType.LightsUpdated, lights as Light[])
  );
  get('/api/patterns').then((patterns) =>
    dispatch(ActionType.PatternsUpdated, patterns as Pattern[])
  );
}
run();
