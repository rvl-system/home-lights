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
exports.run = void 0;
const endpoints_1 = require("./endpoints");
const db_1 = require("./db");
const device_1 = require("./device");
async function run() {
    await db_1.init();
<<<<<<< HEAD
    await device_1.init();
    await endpoints_1.init();
    console.log('\n=== Home Lights Running ===\n');
=======
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
        console.log(`Server listening on ${address}`);
    });
>>>>>>> rewrite
}
exports.run = run;
//# sourceMappingURL=index.js.map