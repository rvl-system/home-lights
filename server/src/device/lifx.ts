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

import fetch from 'node-fetch';

const LIFX_URL = 'https://api.lifx.com/v1';
const TOKEN = process.env['LIFX_TOKEN'];

// get lights descriptors: curl -H "Authorization: Bearer ${token}" "https://api.lifx.com/v1/lights/all"

async function getLights(token: string) {
  const response = await fetch(`${LIFX_URL}/lights/all`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await response.json();
}

export async function init(): Promise<void> {
  if (!TOKEN) {
    console.log('No LIFX token found, disabling LIFX support');
    return;
  }
  console.log('Discovering LIFX lights');
  const lights = await getLights(TOKEN);
  console.log(lights);
}
