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
import { CreateSceneRequest, Scene } from '../common/types';
import { getScenes, createScene, editScene, deleteScene } from '../db/scenes';

export function init(app: FastifyInstance): void {
  app.get('/api/scenes', async () => {
    return await getScenes();
  });

  app.post('/api/scenes', async (req) => {
    const sceneRequest = req.body as CreateSceneRequest;
    await createScene(sceneRequest);
    return {};
  });

  app.put('/api/scene/:id', async (req) => {
    const scene = req.body as Scene;
    await editScene(scene);
    return {};
  });

  app.delete('/api/scene/:id', async (req) => {
    const { id } = req.params as { id: string };
    await deleteScene(parseInt(id));
    return {};
  });
}
