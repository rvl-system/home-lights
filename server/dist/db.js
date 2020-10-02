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
exports.deleteLight = exports.editLight = exports.createLight = exports.getLights = exports.deleteZone = exports.editZone = exports.createZone = exports.getZones = exports.init = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("./util");
const sqlite_1 = require("./sqlite");
const types_1 = require("./common/types");
const config_1 = require("./common/config");
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
  channel INTEGER
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
    }
    console.log('Database initialized');
}
exports.init = init;
// ---- Zone Operations ----
async function getZones() {
    return sqlite_1.dbAll(`SELECT * FROM zones`);
}
exports.getZones = getZones;
async function createZone(zoneRequest) {
    await sqlite_1.dbRun(`INSERT INTO zones (name) values (?)`, [zoneRequest.name]);
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
// ---- Light Operations ----
async function getLights() {
    return sqlite_1.dbAll(`SELECT * FROM lights`);
}
exports.getLights = getLights;
async function createLight(lightRequest) {
    switch (lightRequest.type) {
        case types_1.LightType.RVL: {
            const rvlLightRequest = lightRequest;
            if (!Number.isInteger(rvlLightRequest.channel) ||
                rvlLightRequest.channel < 0 ||
                rvlLightRequest.channel >= config_1.NUM_RVL_CHANNELS) {
                throw new Error(`Invalid RVL channel ${rvlLightRequest.channel}`);
            }
            await sqlite_1.dbRun(`INSERT INTO lights (name, type, channel) values (?, ?, ?)`, [
                rvlLightRequest.name,
                types_1.LightType.RVL,
                rvlLightRequest.channel
            ]);
            break;
        }
        case types_1.LightType.PhilipsHue: {
            const philipsHueLightRequest = lightRequest;
            await sqlite_1.dbRun(`INSERT INTO lights (name, type) values (?, ?)`, [
                philipsHueLightRequest.name,
                types_1.LightType.RVL
            ]);
            break;
        }
    }
}
exports.createLight = createLight;
async function editLight(light) {
    switch (light.type) {
        case types_1.LightType.RVL:
            const rvlLight = light;
            await sqlite_1.dbRun('UPDATE lights SET name = ?, channel = ? WHERE id = ?', [
                rvlLight.name,
                rvlLight.channel,
                rvlLight.id
            ]);
            break;
        case types_1.LightType.PhilipsHue:
            const hueLight = light;
            await sqlite_1.dbRun('UPDATE lights SET name = ?, WHERE id = ?', [
                hueLight.name,
                hueLight.id
            ]);
            break;
    }
}
exports.editLight = editLight;
async function deleteLight(id) {
    await sqlite_1.dbRun('DELETE FROM lights WHERE id = ?', [id]);
}
exports.deleteLight = deleteLight;
//# sourceMappingURL=db.js.map