"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("./util");
const sqlite_1 = require("./sqlite");
const DB_FILE = path_1.join(util_1.getEnvironmentVariable('HOME'), '.homelights', 'db.sqlite3');
const ZONE_SCHEMA = `
CREATE TABLE "zones" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
)`;
const LIGHT_SCHEMA = `
CREATE TABLE "lights" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  channel INTEGER UNIQUE,
  zone_id INTEGER,
  FOREIGN KEY (zone_id) REFERENCES zones(id)
)`;
const PHILIPS_HUE_INFO_SCHEMA = `
CREATE TABLE "philips_hue_info" (
  username TEXT NOT NULL UNIQUE,
  key TEXT NOT NULL
)`;
async function init() {
    const isNewDB = !fs_1.existsSync(DB_FILE);
    if (isNewDB) {
        fs_1.mkdirSync(path_1.dirname(DB_FILE), {
            recursive: true
        });
        console.log(`Creating database at ${DB_FILE}`);
    }
    else {
        console.log(`Loading database from ${DB_FILE}`);
    }
    await sqlite_1.init(DB_FILE);
    if (isNewDB) {
        console.log(`Initializing new database`);
        await sqlite_1.dbRun(ZONE_SCHEMA);
        await sqlite_1.dbRun(LIGHT_SCHEMA);
        await sqlite_1.dbRun(PHILIPS_HUE_INFO_SCHEMA);
    }
    console.log('Database initialized');
}
exports.init = init;
//# sourceMappingURL=db.js.map