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

import * as React from 'react';
import { Switch } from '@material-ui/core';
import { Room } from '../../common/types';
import { EditMode } from '../../types';

export interface RoomPowerSwitchProps {
  room: Room;
  editMode: EditMode;
  className: string;
}

export interface RoomPowerSwitchDispatch {
  toggleRoomPower: (id: number, powerState: boolean) => void;
}

export function RoomPowerSwitch(
  props: RoomPowerSwitchProps & RoomPowerSwitchDispatch
): JSX.Element {
  return (
    <React.Fragment>
      {props.editMode === EditMode.view && (
        <Switch
          className={props.className}
          color="default"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) =>
            props.toggleRoomPower(props.room.id, e.currentTarget.checked)
          }
        />
      )}
    </React.Fragment>
  );
}
