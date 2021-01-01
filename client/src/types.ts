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
  SelectedTab,
  Notification,
  Light,
  SystemState,
  Pattern,
  Scene,
  Zone,
  Schedule
} from './common/types';

export enum SliceName {
  Zones = 'Zones',
  Schedules = 'Schedules',
  Scenes = 'Scenes',
  Patterns = 'Patterns',
  Lights = 'Lights',
  Colors = 'Colors',
  State = 'State',
  SelectedTab = 'SelectedTab',
  Notification = 'Notification'
}

export interface State {
  [SliceName.Zones]: Zone[];
  [SliceName.Schedules]: Schedule[];
  [SliceName.Scenes]: { scenes: Scene[]; version: number };
  [SliceName.Lights]: Light[];
  [SliceName.Patterns]: Pattern[];
  [SliceName.State]: SystemState;
  [SliceName.SelectedTab]: SelectedTab;
  [SliceName.Notification]: Notification | null;
}

// Color is a drop-in value to various Material UI components, which is why we
// use a set of string values instead of an enum
export type UIColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'default'
  | undefined;
