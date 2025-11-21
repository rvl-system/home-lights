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

import { ActionType } from '../common/actions.js';
import { Zone } from '../common/types.js';
import { dbRun, dbAll } from '../sqlite.js';
import { ActionHandler } from '../types.js';

const ZONES_TABLE_NAME = 'zones';

let zones: Zone[] = [];

export default function updateCache() {
  zones = dbAll<Zone>(`SELECT * FROM ${ZONES_TABLE_NAME}`);
}

export function getZones(): Zone[] {
  return zones;
}

export const createZone: ActionHandler<ActionType.CreateZone> = async (
  request
) => {
  dbRun(`INSERT INTO ${ZONES_TABLE_NAME} (name) VALUES (?)`, [request.name]);
  updateCache();
};

export const editZone: ActionHandler<ActionType.EditZone> = async (request) => {
  dbRun(`UPDATE ${ZONES_TABLE_NAME} SET name = ? WHERE id = ?`, [
    request.name,
    request.id
  ]);
  updateCache();
};

export const deleteZone: ActionHandler<ActionType.DeleteZone> = async (
  request
) => {
  dbRun(`DELETE FROM ${ZONES_TABLE_NAME} WHERE id = ?`, [request.id]);
  updateCache();
};
