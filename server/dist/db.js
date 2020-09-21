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
exports.deleteZone = exports.editZone = exports.createZone = exports.getZones = exports.init = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("./util");
const sqlite_1 = require("./sqlite");
const DB_FILE = path_1.join(util_1.getEnvironmentVariable('HOME'), '.homelights', 'db.sqlite3');
const ROOM_SCHEMA = `
CREATE TABLE "zones" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL UNIQUE
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
        await sqlite_1.dbRun(ROOM_SCHEMA);
    }
}
exports.init = init;
async function getZones() {
    return sqlite_1.dbAll(`SELECT * FROM zones`);
}
exports.getZones = getZones;
async function createZone(zoneRequest) {
    try {
        await sqlite_1.dbRun(`INSERT INTO zones (name) values (?)`, [zoneRequest.name]);
    }
    catch (err) {
        console.log('ERROR IN db.ts ', typeof err);
    }
}
exports.createZone = createZone;
async function editZone(zone) {
    await sqlite_1.dbRun('UPDATE zones SET name = ? WHERE id = ?', [zone.name, zone.id]);
}
exports.editZone = editZone;
async function deleteZone(id) {
    await sqlite_1.dbRun('DELETE FROM zones WHERE id = ?', [id]);
}
exports.deleteZone = deleteZone;
//# sourceMappingURL=db.js.map