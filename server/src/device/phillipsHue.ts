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

import { v3 } from 'node-hue-api';
import {
  PHILIPS_HUE_APP_NAME,
  PHILIPS_HUE_DEVICE_NAME
} from '../common/config';

let authenticatedApi;

export async function init(): Promise<void> {
  const bridgeIP = await discoverBridge();
  if (!bridgeIP) {
    return;
  }
  const username = await discoverOrCreateUser(bridgeIP);
  authenticatedApi = await v3.api.createLocal(bridgeIP).connect(username);
  console.log(authenticatedApi);
  console.log('Phillips Hue devices initialized');
}

async function discoverBridge(): Promise<string | null> {
  const bridges = await v3.discovery.nupnpSearch();

  if (bridges.length === 0) {
    console.log(
      'No Philips Hue bridges found, calls to set state on Philips Hue lights will be ignored'
    );
    return null;
  } else if (bridges.length > 1) {
    console.log(
      'More than one Philips Hue bridge found. Multiple bridges are not supported by Home Lights'
    );
    return null;
  } else {
    return bridges[0].ipaddress;
  }
}

async function discoverOrCreateUser(bridgeIP: string): Promise<string> {
  // Create an unauthenticated instance of the Hue API so that we can create a new user
  const unauthenticatedApi = await v3.api.createLocal(bridgeIP).connect();

  // Check if the user has been created already, and if so return it
  const users = await unauthenticatedApi.users.getUserByName(
    PHILIPS_HUE_APP_NAME,
    PHILIPS_HUE_DEVICE_NAME
  );
  if (users.length) {
    return users[0].username;
  }

  // Otherwise we need to create the user
  console.log(
    `Philips Hue user "${PHILIPS_HUE_DEVICE_NAME}" not found, creating...`
  );
  let createdUser;
  try {
    createdUser = await unauthenticatedApi.users.createUser(
      PHILIPS_HUE_APP_NAME,
      PHILIPS_HUE_DEVICE_NAME
    );
  } catch (e) {
    if (e.getHueErrorType() === 101) {
      console.error(
        'The Link button on the bridge was not pressed. Please press the Link button and try again.'
      );
    } else {
      throw e;
    }
  }
  return createdUser.username;
}
