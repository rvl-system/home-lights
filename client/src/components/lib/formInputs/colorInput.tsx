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

import { Button, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FunctionComponent, useState } from 'react';
import { Color, ColorType } from '../../../common/types';
import { ColorSchema } from './schema';

export const useStyles = makeStyles({
  colorButton: {
    width: '5em',
    height: '2em'
  }
});

export type ColorInputProps = Omit<ColorSchema, 'type'>;

export interface ColorInputDispatch {
  onChange: (color: Color) => void;
}

export function getDefaultColorValue(props: ColorInputProps): Color {
  return (
    props.defaultValue || {
      type: ColorType.HSV,
      hue: 0,
      saturation: 1
    }
  );
}

export const ColorInput: FunctionComponent<
  ColorInputProps & ColorInputDispatch
> = (props) => {
  const classes = useStyles();

  const [color, setColor] = useState(getDefaultColorValue(props));

  return (
    <>
      {props.description && <InputLabel>{props.description}</InputLabel>}
      <Button variant="outlined">
        <div
          className={classes.colorButton}
          style={{ backgroundColor: `hsl(${0}, ${100}%, 50%)` }}
        ></div>
      </Button>
    </>
  );
};
