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

import {
  CreatePatternRequest,
  CreateSceneRequest,
  Light,
  SystemState,
  Pattern,
  Scene,
  Zone,
  AppState
} from './common/types';

export enum SliceName {
  Zones = 'Zones',
  Scenes = 'Scenes',
  Patterns = 'Patterns',
  Lights = 'Lights',
  Colors = 'Colors',
  State = 'State',
  SelectedTab = 'SelectedTab',
  Notification = 'Notification'
}

export enum ActionType {
  SelectTab = 'SelectTab',
  Notify = 'Notify',
  DismissNotification = 'DismissNotification',

  AppStateUpdated = 'StateUpdated',
  SetZoneScene = 'SetZoneScene',
  SetZonePower = 'SetZonePower',
  SetZoneBrightness = 'SetZoneBrightness',

  ZonesUpdated = 'ZonesUpdated',
  CreateZone = 'CreateZone',
  DeleteZone = 'DeleteZone',
  EditZone = 'EditZone',

  ScenesUpdated = 'ScenesUpdated',
  CreateScene = 'CreateScene',
  DeleteScene = 'DeleteScene',
  EditScene = 'EditScene',

  PatternsUpdated = 'PatternsUpdated',
  CreatePattern = 'CreatePattern',
  EditPattern = 'EditPattern',
  DeletePattern = 'DeletePattern',

  LightsUpdated = 'LightsUpdated',
  CreateRVLLight = 'CreateRVLLight',
  EditLight = 'EditLight',
  DeleteLight = 'DeleteLight'
}

export interface State {
  [SliceName.Zones]: Zone[];
  [SliceName.Scenes]: Scene[];
  [SliceName.Lights]: Light[];
  [SliceName.Patterns]: Pattern[];
  [SliceName.State]: SystemState;
  [SliceName.SelectedTab]: SelectedTab;
  [SliceName.Notification]: Notification | null;
}

export interface Actions {
  [ActionType.SelectTab]: SelectedTab;
  [ActionType.Notify]: Notification;
  [ActionType.DismissNotification]: undefined;

  [ActionType.AppStateUpdated]: AppState;

  [ActionType.SetZoneScene]: { zoneId: number; sceneId: number };
  [ActionType.SetZonePower]: { zoneId: number; power: boolean };
  [ActionType.SetZoneBrightness]: { zoneId: number; brightness: number };

  [ActionType.CreateZone]: string;
  [ActionType.EditZone]: Zone;
  [ActionType.DeleteZone]: number;

  [ActionType.CreateScene]: CreateSceneRequest;
  [ActionType.EditScene]: Scene;
  [ActionType.DeleteScene]: number;

  [ActionType.CreatePattern]: CreatePatternRequest;
  [ActionType.EditPattern]: Pattern;
  [ActionType.DeletePattern]: number;

  [ActionType.CreateRVLLight]: {
    name: string;
    channel: number;
    zoneId?: number;
  };
  [ActionType.EditLight]: Light;
  [ActionType.DeleteLight]: number;
}

export enum SelectedTab {
  Zones = 'Zones',
  Patterns = 'Patterns',
  Lights = 'Lights'
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

// Color is a drop-in value to various Material UI components, which is why we
// use a set of string values instead of an enum
export type UIColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'default'
  | undefined;
