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
  AppState,
  Light,
  Notification,
  Pattern,
  Scene,
  Schedule,
  ScheduleEntry,
  SelectedTab,
  Zone
} from './types';

export enum ActionType {
  SelectTab = 'SelectTab',
  Notify = 'Notify',
  DismissNotification = 'DismissNotification',

  Hello = 'Hello',
  AppStateUpdated = 'AppStateUpdated',

  SetZoneScene = 'SetZoneScene',
  SetZonePower = 'SetZonePower',
  SetZoneBrightness = 'SetZoneBrightness',

  CreateZone = 'CreateZone',
  EditZone = 'EditZone',
  DeleteZone = 'DeleteZone',

  CreateSchedule = 'CreateSchedule',
  EditSchedule = 'EditSchedule',

  CreateScene = 'CreateScene',
  EditScene = 'EditScene',
  DeleteScene = 'DeleteScene',

  CreatePattern = 'CreatePattern',
  EditPattern = 'EditPattern',
  DeletePattern = 'DeletePattern',

  CreateRVLLight = 'CreateRVLLight',
  EditLight = 'EditLight',
  DeleteLight = 'DeleteLight'
}

export interface Actions {
  [ActionType.SelectTab]: SelectedTab;
  [ActionType.Notify]: Notification;
  [ActionType.DismissNotification]: undefined;

  [ActionType.Hello]: AppState;
  [ActionType.AppStateUpdated]: AppState;

  [ActionType.SetZoneScene]: { zoneId: number; sceneId: number };
  [ActionType.SetZonePower]: { zoneId: number; power: boolean };
  [ActionType.SetZoneBrightness]: {
    zoneId: number;
    sceneId: number;
    brightness: number;
  };

  [ActionType.CreateZone]: Omit<Zone, 'id'>;
  [ActionType.EditZone]: Zone;
  [ActionType.DeleteZone]: { id: number };

  [ActionType.CreateSchedule]: { zoneId: number; entries: ScheduleEntry[] };
  [ActionType.EditSchedule]: Schedule;

  [ActionType.CreateScene]: Omit<Scene, 'id' | 'brightness'>;
  [ActionType.EditScene]: Scene;
  [ActionType.DeleteScene]: { id: number };

  [ActionType.CreatePattern]: Omit<Pattern, 'id'>;
  [ActionType.EditPattern]: Pattern;
  [ActionType.DeletePattern]: { id: number };

  [ActionType.CreateRVLLight]: {
    name: string;
    channel: number;
    zoneId?: number;
  };
  [ActionType.EditLight]: Light;
  [ActionType.DeleteLight]: { id: number };
}
