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

// ---- App State ----

export interface AppState {
  zones: Zone[];
  schedules: Schedule[];
  scenes: Scene[];
  patterns: Pattern[];
  lights: Light[];
  systemState: SystemState;
  settings: Settings;
  version: number;
}

// ---- Zone Types ----

export interface Zone {
  id: number;
  name: string;
}

// ---- Light Types ----

export enum LightType {
  RVL = 'rvl',
  PhilipsHue = 'philips-hue',
  LIFX = 'lifx'
}

// Raw variants represent what's in the database
interface RawBaseLight {
  id: number;
  type: LightType;
  name: string;
  zone_id?: number;
}

interface RawRVLLight extends RawBaseLight {
  type: LightType.RVL;
  channel: number;
}

interface RawPhilipsHueLight extends RawBaseLight {
  type: LightType.PhilipsHue;
  philips_hue_id: string;
}

interface RawLIFXLight extends RawBaseLight {
  type: LightType.LIFX;
  lifx_id: string;
}

export type RawLight = RawRVLLight | RawPhilipsHueLight | RawLIFXLight;

interface BaseLight {
  id: number;
  type: LightType;
  name: string;
  zoneId?: number;
}

export interface RVLLight extends BaseLight {
  type: LightType.RVL;
  channel: number;
}

export interface PhilipsHueLight extends BaseLight {
  type: LightType.PhilipsHue;
  philipsHueID: string;
}

export interface LIFXLight extends BaseLight {
  type: LightType.LIFX;
  lifxId: string;
}

export type Light = RVLLight | PhilipsHueLight | LIFXLight;

// ---- Scene Types ----

export interface SceneLightEntry {
  lightId: number;
  patternId?: number;
  brightness: number;
}

export interface Scene {
  id: number;
  zoneId: number;
  name: string;
  brightness: number;
  lights: SceneLightEntry[];
}

export interface RawScene {
  id: number;
  zone_id: number;
  name: string;
  brightness: number;
  lights: string;
}

// ---- Pattern Types ----

export enum PatternType {
  Solid = 'solid',
  Pulse = 'pulse',
  Rainbow = 'rainbow',
  ColorCycle = 'colorCycle',
  Wave = 'wave'
}

export enum ColorType {
  HSV = 'HSV',
  Temperature = 'Temperature'
}

export interface HSVColor {
  type: ColorType.HSV;
  hue: number;
  saturation: number;
}

export interface TemperatureColor {
  type: ColorType.Temperature;
  temperature: number;
}

export type Color = HSVColor | TemperatureColor;

export interface Pattern {
  id: number;
  name: string;
  type: PatternType;
  data: Record<string, unknown>;
}

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
    distancePeriod: number;
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
  type: PatternType.Wave;
  data: {
    distancePeriod: number;
    rate: number;
    waveColor: Color;
    foregroundColor: Color;
    backgroundColor: Color;
  };
}
export type CreateWavePatternRequest = Omit<WavePattern, 'id'>;

// ---- Schedule Types ----

interface RawScheduleEntry {
  id: number;
  scene_id: number | undefined;
  hour: number;
  minute: number;
}

export interface RawSchedule {
  id: number;
  zone_id: number;
  entries: RawScheduleEntry[];
}

export interface ScheduleEntry {
  id: number;
  sceneId: number | undefined;
  hour: number;
  minute: number;
}

export interface Schedule {
  id: number;
  zoneId: number;
  entries: ScheduleEntry[];
}

// ---- System State ----

export interface RawZoneState {
  zone_id: number;
  power: number;
  current_scene_id: number | undefined;
}

export interface ZoneState {
  zoneId: number;
  power: boolean;
  currentSceneId: number | undefined;
  currentScheduleSceneId: number | undefined;
}

export interface RVLInfo {
  availableInterfaces: string[];
  networkInterface?: string;
}

export interface SystemState {
  zoneStates: ZoneState[];
  philipsHueBridgeIp: string | undefined;
  rvlInfo: RVLInfo;
}

export interface SetZoneSceneRequest {
  sceneId: number;
}

export interface SetZonePowerRequest {
  zoneId: number;
  power: boolean;
}

export interface SetZoneBrightnessRequest {
  zoneId: number;
  brightness: number;
}

// ---- Miscellaneous ----

export enum SelectedTab {
  Zones = 'Zones',
  Patterns = 'Patterns',
  Lights = 'Lights',
  Settings = 'Settings'
}

export enum Theme {
  Auto = 'Auto',
  Light = 'Light',
  Dark = 'Dark'
}

export interface Settings {
  theme: Theme;
}

// Severity is a drop-in value to Material UI's Snackbar severity, which is why
// we use a set of string values instead of an enum
export interface Notification {
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

export enum EditMode {
  Operation = 'Operation',
  Edit = 'Edit'
}

export interface Migration {
  migration: number;
  date: string;
}
