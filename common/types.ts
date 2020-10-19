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

// ---- Zone Types ----

export interface Zone {
  id: number;
  name: string;
}

export interface CreateZoneRequest {
  name: string;
}

// ---- Light Types ----

export enum LightType {
  RVL = 'rvl',
  PhilipsHue = 'philips-hue'
}

export interface Light {
  id: number;
  type: LightType;
  name: string;
  zoneID?: number;
}

export interface RVLLight extends Light {
  type: LightType.RVL;
  channel: number;
}

export interface PhilipsHueLight extends Light {
  type: LightType.PhilipsHue;
  philipsHueID: string;
}

export type CreateLightRequest = Omit<Light, 'id'>;

export type CreateRVLLightRequest = Omit<RVLLight, 'id'>;

export type CreatePhilipsHueLightRequest = Omit<PhilipsHueLight, 'id'>;

// ---- Scene Types ----

export interface Scene {
  id: number;
  // TODO
}

// ---- Light State ----

export interface RoomLightState {
  power: boolean;
  scene: Scene;
}

export interface SetLightStateRequest {
  rooms: RoomLightState[];
}

export interface RVLLight extends Light {
  type: LightType.RVL;
  channel: number;
}

export interface PhilipsHueLight extends Light {
  type: LightType.PhilipsHue;
}

// ---- Light State ----

export interface RoomLightState {
  power: boolean;
  scene: Scene;
}

export interface SetLightStateRequest {
  rooms: RoomLightState[];
}
