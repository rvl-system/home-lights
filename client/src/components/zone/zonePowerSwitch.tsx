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

import { Switch } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Zone } from '../../common/types';
import { EditMode } from '../../types';

export interface ZonePowerSwitchProps {
  zone: Zone;
  editMode: EditMode;
  className: string;
}

export interface ZonePowerSwitchDispatch {
  toggleZonePower: (id: number, powerState: boolean) => void;
}

export const ZonePowerSwitch: FunctionComponent<
  ZonePowerSwitchProps & ZonePowerSwitchDispatch
> = (props) => {
  return (
    <React.Fragment>
      {props.editMode === EditMode.Operation && (
        <Switch
          className={props.className}
          color="default"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) =>
            props.toggleZonePower(props.zone.id, e.currentTarget.checked)
          }
        />
      )}
    </React.Fragment>
  );
};
