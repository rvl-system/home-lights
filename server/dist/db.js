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
exports.init = exports.reset = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("./util");
const sqlite_1 = require("./sqlite");
const zones_1 = require("./db/zones");
const lights_1 = require("./db/lights");
const philipsHue_1 = require("./db/philipsHue");
const DB_FILE = path_1.join(util_1.getEnvironmentVariable('HOME'), '.homelights', 'db.sqlite3');
async function reset() {
    console.log('Resetting database...');
    await init();
    await sqlite_1.dbAll(`DROP TABLE zones`);
    await sqlite_1.dbAll(`DROP TABLE lights`);
    await sqlite_1.dbAll(`DROP TABLE philips_hue_info`);
    await create();
    console.log('done');
}
exports.reset = reset;
async function create() {
    console.log(`Creating database tables...`);
    await sqlite_1.dbRun(zones_1.ZONE_SCHEMA);
    await sqlite_1.dbRun(lights_1.LIGHT_SCHEMA);
    await sqlite_1.dbRun(philipsHue_1.PHILIPS_HUE_INFO_SCHEMA);
}
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
        await create();
    }
    console.log('Database initialized');
}
exports.init = init;
//# sourceMappingURL=db.js.map