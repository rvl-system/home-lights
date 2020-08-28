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
exports.run = void 0;
const path_1 = require("path");
const fastify_1 = __importDefault(require("fastify"));
const fastify_static_1 = __importDefault(require("fastify-static"));
const util_1 = require("./util");
const db_1 = require("./db");
async function run() {
    const port = parseInt(util_1.getEnvironmentVariable('PORT', '3000'));
    const app = fastify_1.default({
        logger: true
    });
    await db_1.init();
    app.register(fastify_static_1.default, {
        root: path_1.join(__dirname, '..', '..', 'public')
    });
    app.get('/api/rooms', async () => {
        return await db_1.getRooms();
    });
    app.post('/api/rooms', async (req) => {
        const roomRequest = req.body;
        await db_1.createRoom(roomRequest);
        return {};
    });
    app.put('/api/room/:id', async (req) => {
        const room = req.body;
        await db_1.editRoom(room);
        return {};
    });
    app.delete('/api/room/:id', async (req) => {
        const { id } = req.params;
        await db_1.deleteRoom(parseInt(id));
        return {};
    });
    app.listen(port, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        console.log(`Server listening on ${address}`);
    });
}
exports.run = run;
//# sourceMappingURL=index.js.map