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

import { join } from 'path';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import { init as initLights } from './endpoints/lights';
import { init as initPatterns } from './endpoints/patterns';
import { init as initScenes } from './endpoints/scenes';
import { init as initState } from './endpoints/state';
import { init as initZones } from './endpoints/zones';
import { getEnvironmentVariable } from './util';

export function init(): Promise<void> {
  return new Promise((resolve) => {
    const port = parseInt(getEnvironmentVariable('PORT', '3000'));
    const app = fastify();

    app.register(fastifyStatic, {
      root: join(__dirname, '..', '..', 'public')
    });

    initZones(app);
    initScenes(app);
    initPatterns(app);
    initLights(app);
    initState(app);

    app.listen(port, (err, address) => {
      if (err) {
        throw err;
      }
      console.log(`Endpoints initialized at ${address}`);
      resolve();
    });
  });
}
