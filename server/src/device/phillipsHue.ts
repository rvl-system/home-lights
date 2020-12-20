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

import { v3 as philipsHue } from 'node-hue-api';
import Api = require('node-hue-api/lib/api/Api');
import {
  MAX_BRIGHTNESS,
  PHILIPS_HUE_APP_NAME,
  PHILIPS_HUE_DEVICE_NAME
} from '../common/config';
import {
  CreatePhilipsHueLightRequest,
  LightType,
  PatternType,
  PhilipsHueLight,
  SolidPattern
} from '../common/types';
import { getItem } from '../common/util';
import { getLights, createLight, deleteLight } from '../db/lights';
import { getPhilipsHueInfo, setPhilipsHueInfo } from '../db/philipsHue';
import { SetLightStateOptions } from './types';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { LightState } = philipsHue.lightStates;
let authenticatedApi: Api | undefined;
const idMap = new Map<string, number>();

export async function init(): Promise<void> {
  console.log('Looking for Philips Hue bridge...');
  const bridgeIP = await discoverBridge();
  if (!bridgeIP) {
    return;
  }
  console.log(`Connecting to Philips Hue bridge at ${bridgeIP}...`);
  const username = await getOrCreateUser(bridgeIP);
  authenticatedApi = await philipsHue.api
    .createLocal(bridgeIP)
    .connect(username);
  await updateLights();
  console.log('Phillips Hue bridge initialized');
}

export async function setLightState({
  zoneState,
  scene,
  lights,
  patterns
}: SetLightStateOptions): Promise<void> {
  if (
    zoneState.currentSceneId === undefined ||
    authenticatedApi === undefined
  ) {
    return;
  }
  const promises: Promise<void>[] = [];
  for (const lightEntry of scene.lights) {
    const light = getItem(lightEntry.lightId, lights);
    if (light.type !== LightType.PhilipsHue) {
      continue;
    }

    let lightState: InstanceType<typeof LightState>;
    if (!zoneState.power) {
      lightState = new LightState().off();
    } else if (lightEntry.patternId !== undefined) {
      const pattern = getItem(lightEntry.patternId, patterns) as SolidPattern;
      if (pattern.type !== PatternType.Solid) {
        throw new Error(
          `Internal Error: pattern type ${pattern.type} cannot be used with Philips Hue`
        );
      }
      lightState = new LightState()
        .on(true)
        .hsb(
          pattern.data.color.hue,
          Math.round(pattern.data.color.saturation * 100),
          Math.round(
            (lightEntry.brightness / MAX_BRIGHTNESS) *
              (scene.brightness / MAX_BRIGHTNESS) *
              100
          )
        );
    } else {
      lightState = new LightState().off();
    }

    promises.push(
      authenticatedApi.lights.setLightState(
        idMap.get((light as PhilipsHueLight).philipsHueID),
        lightState
        // The Hue API does strange things with types, gotta cast to any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any
    );
  }
  await Promise.all(promises);
}

async function discoverBridge(): Promise<string | undefined> {
  // The Hue API does strange things with types, gotta cast to any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bridges: any;
  try {
    bridges = await philipsHue.discovery.nupnpSearch();
  } catch {
    console.log(
      'Failed to search for Philips Hue bridges, calls to set state on Philips Hue lights will be ignored'
    );
    return;
  }

  if (bridges.length === 0) {
    console.log(
      'No Philips Hue bridges found, calls to set state on Philips Hue lights will be ignored'
    );
    return;
  } else if (bridges.length > 1) {
    console.log(
      'More than one Philips Hue bridge found. Multiple bridges are not supported by Home Lights'
    );
    return;
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
  const unauthenticatedApi = await philipsHue.api
    .createLocal(bridgeIP)
    .connect();

  // Create the user and store it to the database for future use
  try {
    const {
      username,
      clientkey: key
    } = await unauthenticatedApi.users.createUser(
      PHILIPS_HUE_APP_NAME,
      PHILIPS_HUE_DEVICE_NAME
    );
    setPhilipsHueInfo({
      username,
      key
    });
    return username;
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
  if (authenticatedApi === undefined) {
    return;
  }
  console.log('Reconciling Phillips Hue lights in bridge vs database');
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
    idMap.set(bridgeLight.uniqueid, bridgeLight.id);
  }

  // Delete lights from DB that are no longer on the bridge
  for (const dbLight of dbLights) {
    if (dbLight.type !== LightType.PhilipsHue) {
      continue;
    }
    if (
      !bridgeLights.find(
        (bridgeLight) =>
          bridgeLight.uniqueid === (dbLight as PhilipsHueLight).philipsHueID
      )
    ) {
      console.log(
        `Philips Hue light "${dbLight.name}" is no longer registered with the bridge, deleting...`
      );
      await deleteLight(dbLight.id);
    }
  }
}
