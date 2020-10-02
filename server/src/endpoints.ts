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
import { getEnvironmentVariable } from './util';
import {
  getZones,
  createZone,
  editZone,
  deleteZone,
  getLights,
  createLight,
  editLight,
  deleteLight
} from './db';
import {
  CreateZoneRequest,
  Zone,
  CreateLightRequest,
  Light
} from './common/types';

export function init(): Promise<void> {
  return new Promise((resolve) => {
    const port = parseInt(getEnvironmentVariable('PORT', '3000'));
    const app = fastify();

    app.register(fastifyStatic, {
      root: join(__dirname, '..', '..', 'public')
    });

    // ---- Zones Endpoints ----

    app.get('/api/zones', async () => {
      return await getZones();
    });

    app.post('/api/zones', async (req) => {
      const zoneRequest = req.body as CreateZoneRequest;
      await createZone(zoneRequest);
      return {};
    });

    app.put('/api/zone/:id', async (req) => {
      const zone = req.body as Zone;
      await editZone(zone);
      return {};
    });

    app.delete('/api/zone/:id', async (req) => {
      const { id } = req.params as { id: string };
      await deleteZone(parseInt(id));
      return {};
    });

    // ---- Lights Endpoints ----

    app.get('/api/lights', async () => {
      return await getLights();
    });

    app.post('/api/lights', async (req) => {
      const zoneRequest = req.body as CreateLightRequest;
      await createLight(zoneRequest);
      return {};
    });

    app.put('/api/light/:id', async (req) => {
      const zone = req.body as Light;
      await editLight(zone);
      return {};
    });

    app.delete('/api/light/:id', async (req) => {
      const { id } = req.params as { id: string };
      await deleteLight(parseInt(id));
      return {};
    });

    app.listen(port, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      console.log(`Endpoints initialized at ${address}`);
      resolve();
    });
  });
}
