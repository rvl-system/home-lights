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

import { dbRun, dbAll } from '../sqlite';

export const PHILIPS_HUE_TABLE_NAME = 'philips_hue_info';
export const PHILIPS_HUE_INFO_SCHEMA = `
CREATE TABLE "${PHILIPS_HUE_TABLE_NAME}" (
  username TEXT NOT NULL UNIQUE,
  key TEXT NOT NULL
)`;

export interface PhilipsHueInfo {
  username: string;
  key: string;
}

export async function getPhilipsHueInfo(): Promise<PhilipsHueInfo | undefined> {
  const rows = await dbAll(`SELECT * FROM ${PHILIPS_HUE_TABLE_NAME}`);
  switch (rows.length) {
    case 0:
      return;
    case 1:
      return rows[0] as PhilipsHueInfo;
    default:
      throw new Error(
        'Internal Error: philips_hue_info unexpectedly has more than one row'
      );
  }
}

export async function setPhilipsHueInfo(info: PhilipsHueInfo): Promise<void> {
  await dbRun(
    `INSERT INTO ${PHILIPS_HUE_TABLE_NAME} (username, key) VALUES (?, ?)`,
    [info.username, info.key]
  );
}
