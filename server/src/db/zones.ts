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

import { Zone, CreateZoneRequest } from '../common/types';
import { dbRun, dbAll } from '../sqlite';

export const ZONES_TABLE_NAME = 'zones';
export const ZONES_SCHEMA = `
CREATE TABLE "${ZONES_TABLE_NAME}" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
)`;

let zones: Zone[] = [];

export default async function updateCache(): Promise<void> {
  zones = (await dbAll(`SELECT * FROM ${ZONES_TABLE_NAME}`)) as Zone[];
}

export function getZones(): Zone[] {
  return zones;
}

export async function createZone(
  zoneRequest: CreateZoneRequest
): Promise<void> {
  await dbRun(`INSERT INTO ${ZONES_TABLE_NAME} (name) VALUES (?)`, [
    zoneRequest.name
  ]);
  await updateCache();
}

export async function editZone(zone: Zone): Promise<void> {
  await dbRun(`UPDATE ${ZONES_TABLE_NAME} SET name = ? WHERE id = ?`, [
    zone.name,
    zone.id
  ]);
  await updateCache();
}

export async function deleteZone(id: number): Promise<void> {
  await dbRun(`DELETE FROM ${ZONES_TABLE_NAME} WHERE id = ?`, [id]);
  await updateCache();
}
