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
const path_1 = require("path");
const rvl_node_1 = require("rvl-node");
const express = require("express");
const body_parser_1 = require("body-parser");
const WEB_SERVER_PORT = 80;
const RAVER_LIGHTS_INTERFACE = 'wifi0';
const RAVER_LIGHTS_CHANNEL = 5;
var Source;
(function (Source) {
    Source[Source["TV"] = 0] = "TV";
    Source[Source["Kitchen"] = 1] = "Kitchen";
})(Source || (Source = {}));
const rvl = new rvl_node_1.RVL({
    networkInterface: RAVER_LIGHTS_INTERFACE,
    port: 4978,
    mode: 'controller',
    logLevel: 'debug',
    channel: RAVER_LIGHTS_CHANNEL
});
rvl.on('initialized', () => {
    rvl.start();
    const app = express();
    app.use(express.static(path_1.join(__dirname, '..', '..', 'public')));
    app.use(body_parser_1.json());
    app.post('/api/animation', (req, res) => {
        const message = req.body;
        rvl.setWaveParameters(message.waves);
        res.send('ok');
    });
    app.listen(WEB_SERVER_PORT, () => {
        console.log(`Home Lights server running on port ${WEB_SERVER_PORT}!`);
    });
});
//# sourceMappingURL=index.js.map