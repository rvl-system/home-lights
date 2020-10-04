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
exports.setPhilipsHueInfo = exports.getPhilipsHueInfo = void 0;
const sqlite_1 = require("../sqlite");
async function getPhilipsHueInfo() {
    const rows = await sqlite_1.dbAll(`SELECT * FROM "philips_hue_info"`);
    switch (rows.length) {
        case 0:
            return null;
        case 1:
            return rows[0];
        default:
            throw new Error(`Internal Error: philips_hue_info unexpectedly has more than one row`);
    }
}
exports.getPhilipsHueInfo = getPhilipsHueInfo;
async function setPhilipsHueInfo(info) {
    await sqlite_1.dbRun(`INSERT INTO philips_hue_info (username, key) VALUES(?, ?)`, [
        info.username,
        info.key
    ]);
}
exports.setPhilipsHueInfo = setPhilipsHueInfo;
//# sourceMappingURL=philipsHue.js.map