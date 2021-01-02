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

import { InputLabel, Slider } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { RangeSchema } from './schema';

export type RangeInputProps = Omit<RangeSchema, 'type'>;

export interface RangeInputDispatch {
  onChange: (value: number) => void;
}

export function getDefaultRangeValue(props: RangeInputProps): number {
  const max = typeof props.max === 'number' ? props.max : 100;
  return typeof props.defaultValue === 'number' ? props.defaultValue : max;
}

export const RangeInput: FunctionComponent<
  RangeInputProps & RangeInputDispatch
> = (props) => {
  const min = typeof props.min === 'number' ? props.min : 0;
  const max = typeof props.max === 'number' ? props.max : 100;
  const defaultValue = getDefaultRangeValue(props);
  return (
    <>
      {props.label && <InputLabel>{props.label}</InputLabel>}
      <Slider
        defaultValue={defaultValue}
        valueLabelDisplay="auto"
        step={props.step || 1}
        min={min}
        max={max}
        onChange={(e, newValue) =>
          props.onChange((newValue as unknown) as number)
        }
      />
    </>
  );
};
