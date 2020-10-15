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
import Api = require('node-hue-api/lib/api/Api');
import {
  PHILIPS_HUE_APP_NAME,
  PHILIPS_HUE_DEVICE_NAME
} from '../common/config';
import {
  CreatePhilipsHueLightRequest,
  LightType,
  PhilipsHueLight,
  SetLightStateRequest
} from '../common/types';
import { getPhilipsHueInfo, setPhilipsHueInfo } from '../db/philipsHue';
import { getLights, createLight, deleteLight } from '../db/lights';

let authenticatedApi: Api;

export async function init(): Promise<void> {
  const bridgeIP = await discoverBridge();
  if (!bridgeIP) {
    return;
  }
  console.log('Connecting to Philips Hue bridge...');
  const username = await getOrCreateUser(bridgeIP);
  authenticatedApi = await v3.api.createLocal(bridgeIP).connect(username);
  await updateLights();
  console.log('Phillips Hue bridge initialized');
}

export async function setLightState(
  lightState: SetLightStateRequest
): Promise<void> {
  console.log(lightState);
}

async function discoverBridge(): Promise<string | null> {
  let bridges: any;
  try {
    bridges = await v3.discovery.nupnpSearch();
  } catch {
    console.log(
      'Failed to search for Philips Hue bridges, calls to set state on Philips Hue lights will be ignored'
    );
    return null;
  }

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

async function getOrCreateUser(bridgeIP: string): Promise<string> {
  // Check if we've already created a user, and if so return it
  const philipsHueInfo = await getPhilipsHueInfo();
  if (philipsHueInfo) {
    return philipsHueInfo.username;
  }
  console.log(
    'Initializing Philips Hue for use with Home Lights for the first time...'
  );

  // Create an unauthenticated instance of the Hue API so that we can create a new user
  const unauthenticatedApi = await v3.api.createLocal(bridgeIP).connect();

  // Create the user and store it to the database for future user
  try {
    const createdUser = await unauthenticatedApi.users.createUser(
      PHILIPS_HUE_APP_NAME,
      PHILIPS_HUE_DEVICE_NAME
    );
    console.log(createdUser);
    setPhilipsHueInfo({
      username: createdUser.username,
      key: createdUser.clientkey
    });
    return createdUser.username;
  } catch (e) {
    if (e.getHueErrorType() === 101) {
      throw new Error(
        'The Link button on the bridge was not pressed. Please press the Link button and try again.'
      );
    } else {
      throw e;
    }
  }
}

async function updateLights(): Promise<void> {
  const bridgeLights = await authenticatedApi.lights.getAll();
  const dbLights = await getLights();

  // Add lights from the bridge that are not in the DB
  for (const bridgeLight of bridgeLights) {
    if (
      !dbLights.find(
        (dbLight) =>
          dbLight.type === LightType.PhilipsHue &&
          (dbLight as PhilipsHueLight).philipsHueID === bridgeLight.uniqueid
      )
    ) {
      console.log(
        `Found Philips Hue light "${bridgeLight.name}" not in database, adding...`
      );
      const newLight: CreatePhilipsHueLightRequest = {
        philipsHueID: bridgeLight.uniqueid,
        type: LightType.PhilipsHue,
        name: bridgeLight.name
      };
      await createLight(newLight);
    }
  }

  // Delete lights from DB that are no longer on the bridge
  for (const dbLight of dbLights) {
    if (dbLight.type !== LightType.PhilipsHue) {
      continue;
    }
    if (
      !bridgeLights.find(
        (bridgeLights) =>
          bridgeLights.uniqueid === (dbLight as PhilipsHueLight).philipsHueID
      )
    ) {
      console.log(
        `Philips Hue light "${dbLight.name}" is no longer registered with the bridge, deleting...`
      );
      await deleteLight(dbLight.id);
    }
  }
}