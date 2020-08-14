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

import {join} from 'path';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import {getEnvironmentVariable} from './util';

export async function run() {

  const port = parseInt(getEnvironmentVariable('PORT', "3000"));

  const app = fastify({
    logger: true
  });

  app.register(fastifyStatic, {
    root: join(__dirname, '..', '..', 'public')
  });

  app.listen(port, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server listening on ${address}`);
  });
}
