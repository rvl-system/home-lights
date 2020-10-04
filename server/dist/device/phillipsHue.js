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
exports.setLightState = exports.init = void 0;
const node_hue_api_1 = require("node-hue-api");
const config_1 = require("../common/config");
const db_1 = require("../db");
let authenticatedApi;
async function init() {
    const bridgeIP = await discoverBridge();
    if (!bridgeIP) {
        return;
    }
    const username = await getOrCreateUser(bridgeIP);
    authenticatedApi = await node_hue_api_1.v3.api.createLocal(bridgeIP).connect(username);
    const lights = await authenticatedApi.lights.getAll();
    console.log(lights);
    console.log('Phillips Hue devices initialized');
}
exports.init = init;
async function setLightState(lightState) {
    console.log(lightState);
}
exports.setLightState = setLightState;
async function discoverBridge() {
    const bridges = await node_hue_api_1.v3.discovery.nupnpSearch();
    if (bridges.length === 0) {
        console.log('No Philips Hue bridges found, calls to set state on Philips Hue lights will be ignored');
        return null;
    }
    else if (bridges.length > 1) {
        console.log('More than one Philips Hue bridge found. Multiple bridges are not supported by Home Lights');
        return null;
    }
    else {
        return bridges[0].ipaddress;
    }
}
async function getOrCreateUser(bridgeIP) {
    // Check if we've already created a user, and if so return it
    const philipsHueInfo = await db_1.getPhilipsHueInfo();
    if (philipsHueInfo) {
        return philipsHueInfo.username;
    }
    // Create an unauthenticated instance of the Hue API so that we can create a new user
    const unauthenticatedApi = await node_hue_api_1.v3.api.createLocal(bridgeIP).connect();
    // Create the user and store it to the database for future user
    try {
        const createdUser = await unauthenticatedApi.users.createUser(config_1.PHILIPS_HUE_APP_NAME, config_1.PHILIPS_HUE_DEVICE_NAME);
        console.log(createdUser);
        db_1.setPhilipsHueInfo({
            username: createdUser.username,
            key: createdUser.clientkey
        });
        return createdUser.username;
    }
    catch (e) {
        if (e.getHueErrorType() === 101) {
            throw new Error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
        }
        else {
            throw e;
        }
    }
}
//# sourceMappingURL=phillipsHue.js.map