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
  Pattern,
  Scene,
  Zone
} from './common/types';

export enum SliceName {
  Zones = 'Zones',
  Scenes = 'Scenes',
  Patterns = 'Patterns',
  Lights = 'Lights',
  Colors = 'Colors',
  SelectedTab = 'SelectedTab'
}

export enum ActionType {
  SelectTab = 'SelectTab',

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
  [SliceName.SelectedTab]: SelectedTab;
  [SliceName.Patterns]: Pattern[];
}

export interface Actions {
  [ActionType.SelectTab]: SelectedTab;

  [ActionType.ZonesUpdated]: Zone[];
  [ActionType.CreateZone]: string;
  [ActionType.EditZone]: Zone;
  [ActionType.DeleteZone]: number;

  [ActionType.ScenesUpdated]: Scene[];
  [ActionType.CreateScene]: CreateSceneRequest;
  [ActionType.EditScene]: Scene;
  [ActionType.DeleteScene]: number;

  [ActionType.PatternsUpdated]: Pattern[];
  [ActionType.CreatePattern]: CreatePatternRequest;
  [ActionType.EditPattern]: Pattern;
  [ActionType.DeletePattern]: number;

  [ActionType.LightsUpdated]: Light[];
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

export enum EditMode {
  Operation = 'Operation',
  Edit = 'Edit'
}

export type Color = 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
