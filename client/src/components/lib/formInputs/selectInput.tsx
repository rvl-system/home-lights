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

import { InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { SelectSchema } from './schema';

export type SelectInputProps = Omit<SelectSchema, 'type'>;

export interface SelectInputDispatch {
  onChange: (value: string) => void;
}

export function getDefaultSelectValue(props: SelectInputProps): string {
  return props.defaultValue || '';
}

export const SelectInput: FunctionComponent<
  SelectInputProps & SelectInputDispatch
> = (props) => {
  return (
    <>
      {props.description && <InputLabel>{props.description}</InputLabel>}
      <Select
        value={props.defaultValue}
        onChange={(e) => props.onChange(e.target.value as string)}
      >
        {props.options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
