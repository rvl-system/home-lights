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

import { getAvailableInterfaces, getDefaultInterface } from 'rvl-node';
import { RVLInfo } from '../common/types.js';
import { createInternalError } from '../common/util.js';
import { dbRun, dbAll } from '../sqlite.js';

const RVL_TABLE_NAME = 'rvl_info';

let rvlInfo: RVLInfo;

export default function updateCache() {
  const availableInterfaces = getAvailableInterfaces();
  const rows = dbAll<{ id: number; interface: string }>(
    `SELECT * FROM ${RVL_TABLE_NAME}`
  );
  switch (rows.length) {
    case 0:
      if (availableInterfaces.length) {
        // If we don't have an interface set but do have available interfaces,
        // set it to the default. This will always happen once the very first
        // time the device starts up
        const networkInterface = getDefaultInterface();
        if (networkInterface) {
          setRVLInterface(networkInterface);
          rvlInfo = {
            availableInterfaces,
            networkInterface
          };
        }
      } else {
        rvlInfo = { availableInterfaces };
      }
      break;
    case 1:
      rvlInfo = {
        availableInterfaces,
        networkInterface: rows[0].interface
      };
      break;
    default:
      throw createInternalError(
        `${RVL_TABLE_NAME} unexpectedly has more than one row`
      );
  }
}

export function getRVLInfo(): RVLInfo {
  return rvlInfo;
}

export function setRVLInterface(networkInterface: string) {
  dbRun(`REPLACE INTO ${RVL_TABLE_NAME} (id, interface) VALUES (1, ?)`, [
    networkInterface
  ]);
}
