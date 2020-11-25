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
const LOCATION = process.env['LIFX_LOCATION'];

interface LIFXBulbDescriptor {
  id: string;
  uuid: string;
  label: string;
  connected: boolean;
  power: 'on' | 'off';
  color: {
    hue: number;
    saturation: number;
    kelvin: number;
  };
  brightness: number;
  group: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
  product: {
    name: string;
    identifier: string;
    company: string;
    vendor_id: number;
    product_id: number;
    capabilities: {
      has_color: boolean;
      has_variable_color_temp: boolean;
      has_ir: boolean;
      has_chain: boolean;
      has_multizone: boolean;
      min_kelvin: number;
      max_kelvin: number;
    };
  };
  last_seen: string;
  seconds_since_seen: number;
}

async function getLights(token: string, location: string) {
  const response = await fetch(`${LIFX_URL}/lights/location:${location}`, {
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
  if (!LOCATION) {
    throw new Error('LIFX_LOCATION environment variable is required');
  }
  console.log('Discovering LIFX lights');
  const lights = (await getLights(TOKEN, LOCATION)) as LIFXBulbDescriptor[];
  console.log(lights);
}
