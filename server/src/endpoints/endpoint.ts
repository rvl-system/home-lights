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

import { RouteHandlerMethod } from 'fastify';
import { AppState } from '../common/types';
import { getLights } from '../db/lights';
import { getPatterns } from '../db/patterns';
import { getScenes } from '../db/scenes';
import { getZones } from '../db/zones';
import { getSystemState } from '../device';
import { reconcile } from '../reconcile';

export function getAppState(): AppState {
  return {
    zones: getZones(),
    scenes: getScenes(),
    patterns: getPatterns(),
    lights: getLights(),
    systemState: getSystemState()
  };
}

export function post<T>(
  handler: (body: T) => Promise<void>
): RouteHandlerMethod {
  return async function (req) {
    await handler.call(this, req.body as T);
    await reconcile();
    return getAppState();
  };
}

export function put<T>(
  handler: (body: T) => Promise<void>
): RouteHandlerMethod {
  return async function (req) {
    await handler.call(this, req.body as T);
    await reconcile();
    return getAppState();
  };
}

export function del(
  handler: (id: number) => Promise<void>
): RouteHandlerMethod {
  return async function (req) {
    const { id } = req.params as { id: string };
    await handler.call(this, parseInt(id));
    await reconcile();
    return getAppState();
  };
}
