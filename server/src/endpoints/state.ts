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

import { ActionType } from '../common/actions';
import {
  setZoneScene,
  setZonePower,
  setZoneBrightness
} from '../db/zoneStates';
import { refreshLIFXLights } from '../device/lifx';
import { connect, refreshPhilipsHueLights } from '../device/phillipsHue';
import { ActionHandlerEntry } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStateHandlers(): Record<string, ActionHandlerEntry<any>> {
  return {
    [ActionType.SetZoneScene]: { handler: setZoneScene, reconcile: true },
    [ActionType.SetZonePower]: { handler: setZonePower, reconcile: true },
    [ActionType.SetZoneBrightness]: {
      handler: setZoneBrightness,
      reconcile: true
    },
    [ActionType.ConnectPhilipsHueBridge]: { handler: connect, reconcile: true },
    [ActionType.RefreshPhilipsHueLights]: {
      handler: refreshPhilipsHueLights,
      reconcile: true
    },
    [ActionType.RefreshLIFXLights]: {
      handler: refreshLIFXLights,
      reconcile: true
    }
  };
}
