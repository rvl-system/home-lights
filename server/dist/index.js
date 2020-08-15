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
var path_1 = require("path");
var fastify_1 = __importDefault(require("fastify"));
var fastify_static_1 = __importDefault(require("fastify-static"));
var util_1 = require("./util");
function run() {
    var port = parseInt(util_1.getEnvironmentVariable('PORT', '3000'));
    var app = fastify_1.default({
        logger: true
    });
    app.register(fastify_static_1.default, {
        root: path_1.join(__dirname, '..', '..', 'public')
    });
    app.listen(port, function (err, address) {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        app.log.info("Server listening on " + address);
    });
}
exports.run = run;
//# sourceMappingURL=index.js.map