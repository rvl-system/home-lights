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
export type CreateZoneRequest = Omit<Zone, 'id'>;

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
export type CreateLightRequest = Omit<Light, 'id'>;

export interface RVLLight extends Light {
  type: LightType.RVL;
  channel: number;
}
export type CreateRVLLightRequest = Omit<RVLLight, 'id'>;

export interface PhilipsHueLight extends Light {
  type: LightType.PhilipsHue;
  philipsHueID: string;
}
export type CreatePhilipsHueLightRequest = Omit<PhilipsHueLight, 'id'>;

// ---- Scene Types ----

export interface Scene {
  id: number;
  // TODO
}

// ---- Pattern Types ----

export enum PatternType {
  Solid = 'solid',
  Pulse = 'pulse',
  Rainbow = 'rainbow',
  ColorCycle = 'colorCycle',
  Wave = 'wave'
}

export interface Color {
  hue: number;
  saturation: number;
}

export interface Pattern {
  id: number;
  name: string;
  type: PatternType;
  data: Record<string, unknown>;
}
export type CreatePatternRequest = Omit<Pattern, 'id'>;

export interface SolidPattern extends Pattern {
  type: PatternType.Solid;
  data: {
    color: Color;
  };
}
export type CreateSolidPatternRequest = Omit<SolidPattern, 'id'>;

export interface PulsePattern extends Pattern {
  type: PatternType.Pulse;
  data: {
    rate: number;
    color: Color;
  };
}
export type CreatePulsePatternRequest = Omit<PulsePattern, 'id'>;

export interface RainbowPattern extends Pattern {
  type: PatternType.Rainbow;
  data: {
    rate: number;
  };
}
export type CreateRainbowPatternRequest = Omit<RainbowPattern, 'id'>;

export interface ColorCyclePattern extends Pattern {
  type: PatternType.ColorCycle;
  data: {
    rate: number;
  };
}
export type CreateColorCyclePatternRequest = Omit<ColorCyclePattern, 'id'>;

export interface WavePattern extends Pattern {
  type: PatternType.ColorCycle;
  data: {
    rate: number;
    waveColor: Color;
    foregroundColor: Color;
    backgroundColor: Color;
  };
}
export type CreateWavePatternRequest = Omit<WavePattern, 'id'>;

// ---- Light State ----

export interface RoomLightState {
  power: boolean;
  scene: Scene;
}

export interface SetLightStateRequest {
  rooms: RoomLightState[];
}
