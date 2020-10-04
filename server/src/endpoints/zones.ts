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

import { FastifyInstance } from 'fastify';
import { getZones, createZone, editZone, deleteZone } from '../db/zones';
import { CreateZoneRequest, Zone } from '../common/types';

export function init(app: FastifyInstance): void {
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
}
