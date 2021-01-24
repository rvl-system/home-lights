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
import { ActionType } from '../common/actions';
import {
  MAX_BRIGHTNESS,
  PHILIPS_HUE_APP_NAME,
  PHILIPS_HUE_DEVICE_NAME
} from '../common/config';
import {
  ColorType,
  LightType,
  PatternType,
  PhilipsHueLight,
  SolidPattern
} from '../common/types';
import { getItem } from '../common/util';
import { getLights, createLight, deleteLight, editLight } from '../db/lights';
import { getPhilipsHueInfo, setPhilipsHueInfo } from '../db/philipsHue';
import { ActionHandler } from '../types';
import { SetLightStateOptions } from './types';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { LightState } = philipsHue.lightStates;
let authenticatedApi: Api | undefined;
let philipsHueBridgeIp: string | undefined;
const idMap = new Map<string, number>();

export function getPhilipsHueBridgeIp(): string | undefined {
  return philipsHueBridgeIp;
}

export async function init(): Promise<void> {
  const info = await getPhilipsHueInfo();
  if (!info) {
    console.log('Philips Hue not connected');
    return;
  }
  philipsHueBridgeIp = info.ip;
  console.log(`Connecting to Philips Hue bridge at ${philipsHueBridgeIp}...`);
  authenticatedApi = await philipsHue.api
    .createLocal(philipsHueBridgeIp)
    .connect(info.username);
  const bridgeLights = await authenticatedApi.lights.getAll();
  for (const bridgeLight of bridgeLights) {
    idMap.set(bridgeLight.uniqueid, bridgeLight.id);
  }
  console.log('Phillips Hue initialized');
}

export const connect: ActionHandler<ActionType.ConnectPhilipsHueBridge> = async () => {
  console.log('Looking for Philips Hue bridge...');
  philipsHueBridgeIp = await discoverBridge();
  if (!philipsHueBridgeIp) {
    return {
      severity: 'error',
      message: 'Could not connect to bridge'
    };
  }

  console.log(`Connecting to Philips Hue bridge at ${philipsHueBridgeIp}...`);
  const username = await createUser(philipsHueBridgeIp);
  if (!username) {
    philipsHueBridgeIp = undefined;
    return {
      severity: 'error',
      message: 'Link button not pressed'
    };
  }

  authenticatedApi = await philipsHue.api
    .createLocal(philipsHueBridgeIp)
    .connect(username);

  await refreshPhilipsHueLights();

  return {
    severity: 'success',
    message: 'Philips Hue bridge connected'
  };
};

export const refreshPhilipsHueLights: ActionHandler<ActionType.RefreshPhilipsHueLights> = async () => {
  if (authenticatedApi === undefined) {
    return;
  }
  console.log('Reconciling Phillips Hue lights in bridge vs database');
  const bridgeLights = await authenticatedApi.lights.getAll();
  const dbLights = await getLights();

  // Add lights from the bridge that are not in the DB or update changed lights
  for (const bridgeLight of bridgeLights) {
    const dbLight = dbLights.find(
      (dbLight) =>
        dbLight.type === LightType.PhilipsHue &&
        (dbLight as PhilipsHueLight).philipsHueID === bridgeLight.uniqueid
    );
    if (!dbLight) {
      console.log(
        `Found Philips Hue light "${bridgeLight.name}" not in database, adding...`
      );
      const newLight: Omit<PhilipsHueLight, 'id'> = {
        philipsHueID: bridgeLight.uniqueid,
        type: LightType.PhilipsHue,
        name: bridgeLight.name
      };
      await createLight(newLight);
    } else if (dbLight.name !== bridgeLight.name) {
      console.log(
        `Philips Hue light name changed from ${dbLight.name} to ${bridgeLight.name}, updating...`
      );
      await editLight({
        ...dbLight,
        name: bridgeLight.name
      });
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
      await deleteLight({ id: dbLight.id });
    }
  }

  return {
    severity: 'success',
    message: 'Philips Hue lights refreshed'
  };
};

export async function setLightState({
  zoneState,
  scene,
  lights,
  patterns
}: SetLightStateOptions): Promise<void> {
  if (authenticatedApi === undefined) {
    return;
  }
  const promises: Promise<void>[] = [];
  const zoneLights = lights.filter(
    (light) => light.zoneId === zoneState.zoneId
  );
  for (const light of zoneLights) {
    if (light.type !== LightType.PhilipsHue) {
      continue;
    }

    // Handle the case of the light being turned off first and short circuit
    if (scene === undefined || !zoneState.power) {
      promises.push(
        authenticatedApi.lights.setLightState(
          idMap.get((light as PhilipsHueLight).philipsHueID),
          new LightState().off()
          // The Hue API does strange things with types, gotta cast to any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any
      );
      continue;
    }

    const lightEntry = getItem(light.id, scene.lights, 'lightId');
    if (lightEntry.patternId === undefined) {
      promises.push(
        authenticatedApi.lights.setLightState(
          idMap.get((light as PhilipsHueLight).philipsHueID),
          new LightState().off()
          // The Hue API does strange things with types, gotta cast to any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any
      );
      continue;
    }

    let lightState: InstanceType<typeof LightState>;
    const pattern = getItem(lightEntry.patternId, patterns) as SolidPattern;
    if (pattern.type !== PatternType.Solid) {
      throw new Error(
        `Internal Error: pattern type ${pattern.type} cannot be used with Philips Hue`
      );
    }
    const { color } = pattern.data;
    if (color.type === ColorType.HSV) {
      lightState = new LightState()
        .on(true)
        .hsb(
          color.hue,
          Math.round(color.saturation * 100),
          Math.round(
            (lightEntry.brightness / MAX_BRIGHTNESS) *
              (scene.brightness / MAX_BRIGHTNESS) *
              100
          )
        );
    } else {
      lightState = new LightState()
        .on(true)
        .white(
          Math.round(1000000 / color.temperature),
          Math.round(
            (lightEntry.brightness / MAX_BRIGHTNESS) *
              (scene.brightness / MAX_BRIGHTNESS) *
              100
          )
        );
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

async function createUser(bridgeIP: string): Promise<string | undefined> {
  console.log(
    'Initializing the bridge for use with Home Lights for the first time...'
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
      key,
      ip: bridgeIP
    });
    return username;
  } catch (e) {
    if (e.getHueErrorType() === 101) {
      console.warn('The Link button on the bridge was not pressed.');
      return;
    } else {
      throw e;
    }
  }
}
