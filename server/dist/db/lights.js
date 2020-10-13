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
exports.deleteLight = exports.editLight = exports.createLight = exports.getLights = exports.LIGHT_SCHEMA = void 0;
const sqlite_1 = require("../sqlite");
const types_1 = require("../common/types");
const config_1 = require("../common/config");
exports.LIGHT_SCHEMA = `
CREATE TABLE "lights" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  channel INTEGER UNIQUE,
  philips_hue_id TEXT,
  zone_id INTEGER,
  FOREIGN KEY (zone_id) REFERENCES zones(id)
)`;
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
            await sqlite_1.dbRun(`INSERT INTO lights (name, type, philips_hue_id) values (?, ?, ?)`, [
                philipsHueLightRequest.name,
                types_1.LightType.PhilipsHue,
                philipsHueLightRequest.philipsHueID
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
//# sourceMappingURL=lights.js.map