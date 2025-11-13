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

import { init as initDB } from './db';
import { init as initDevice } from './device';
import { init as initEndpoints } from './endpoints';
import { reconcile } from './reconcile';

process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(-1);
});

async function run(): Promise<void> {
  initDB();
  await initDevice();
  await initEndpoints();
  await reconcile(); // Needed to finish any possible migrations
  console.log('\n=== Home Lights Running ===\n');
}
run();
