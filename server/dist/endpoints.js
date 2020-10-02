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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const path_1 = require("path");
const fastify_1 = __importDefault(require("fastify"));
const fastify_static_1 = __importDefault(require("fastify-static"));
const util_1 = require("./util");
const db_1 = require("./db");
function init() {
    return new Promise((resolve) => {
        const port = parseInt(util_1.getEnvironmentVariable('PORT', '3000'));
        const app = fastify_1.default();
        app.register(fastify_static_1.default, {
            root: path_1.join(__dirname, '..', '..', 'public')
        });
        // ---- Zones Endpoints ----
        app.get('/api/zones', async () => {
            return await db_1.getZones();
        });
        app.post('/api/zones', async (req) => {
            const zoneRequest = req.body;
            await db_1.createZone(zoneRequest);
            return {};
        });
        app.put('/api/zone/:id', async (req) => {
            const zone = req.body;
            await db_1.editZone(zone);
            return {};
        });
        app.delete('/api/zone/:id', async (req) => {
            const { id } = req.params;
            await db_1.deleteZone(parseInt(id));
            return {};
        });
        // ---- Lights Endpoints ----
        app.get('/api/lights', async () => {
            return await db_1.getLights();
        });
        app.post('/api/lights', async (req) => {
            const zoneRequest = req.body;
            await db_1.createLight(zoneRequest);
            return {};
        });
        app.put('/api/light/:id', async (req) => {
            const zone = req.body;
            await db_1.editLight(zone);
            return {};
        });
        app.delete('/api/light/:id', async (req) => {
            const { id } = req.params;
            await db_1.deleteLight(parseInt(id));
            return {};
        });
        app.listen(port, (err, address) => {
            if (err) {
                app.log.error(err);
                process.exit(1);
            }
            console.log(`Endpoints initialized at ${address}`);
            resolve();
        });
    });
}
exports.init = init;
//# sourceMappingURL=endpoints.js.map