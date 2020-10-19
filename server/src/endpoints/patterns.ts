/*
Copyright (c) Bryan Hughes <bryan@nebri.us>

This file is part of Home Patterns.

Home Patterns is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Home Patterns is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Home Patterns.  If not, see <http://www.gnu.org/licenses/>.
*/

import { FastifyInstance } from 'fastify';
import {
  getPatterns,
  createPattern,
  editPattern,
  deletePattern
} from '../db/patterns';
import { Pattern, CreatePatternRequest } from '../common/types';

export function init(app: FastifyInstance): void {
  app.get('/api/patterns', async () => {
    return await getPatterns();
  });

  app.post('/api/patterns', async (req) => {
    const patternRequest = req.body as CreatePatternRequest;
    await createPattern(patternRequest);
    return {};
  });

  app.put('/api/patterns/:id', async (req) => {
    const pattern = req.body as Pattern;
    await editPattern(pattern);
    return {};
  });

  app.delete('/api/patterns/:id', async (req) => {
    const { id } = req.params as { id: string };
    await deletePattern(parseInt(id));
    return {};
  });
}
