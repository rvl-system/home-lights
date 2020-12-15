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

import { AppState } from '../common/types';

export async function get<T>(route: string): Promise<T> {
  return send(route, 'GET') as Promise<T>;
}

export async function post(route: string, body: unknown): Promise<AppState> {
  return send(route, 'POST', body) as Promise<AppState>;
}

export async function put(route: string, body: unknown): Promise<AppState> {
  return send(route, 'PUT', body) as Promise<AppState>;
}

export async function del(route: string): Promise<AppState> {
  return send(route, 'DELETE') as Promise<AppState>;
}

async function send(
  route: string,
  method: string,
  body?: unknown
): Promise<unknown> {
  const options: RequestInit = { method, credentials: 'same-origin' };
  if (body) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    options.headers = headers;
    options.body = JSON.stringify(body);
  }
  const res = await fetch(route, options);
  if (!res.ok) {
    throw new Error(`Server returned ${res.statusText || res.status}`);
  }
  return await res.json();
}
