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

import { Settings, Theme } from '../common/types';
import { dbAll, dbRun } from '../sqlite';

const SETTINGS_TABLE_NAME = 'settings';

let settings: Settings = {
  theme: Theme.Auto
};

export default async function updateCache(): Promise<void> {
  settings = (
    await dbAll(`SELECT * FROM ${SETTINGS_TABLE_NAME}`)
  )[0] as Settings;
}

export function getSettings(): Settings {
  return settings;
}

export async function setTheme(theme: Theme): Promise<void> {
  await dbRun(`UPDATE ${SETTINGS_TABLE_NAME} SET theme=?`, [theme]);
  await updateCache();
}
