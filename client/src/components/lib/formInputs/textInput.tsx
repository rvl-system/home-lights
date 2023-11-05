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

import { InputLabel, TextField } from '@material-ui/core';
import React, { FunctionComponent, ChangeEvent, useState } from 'react';
import { TextSchema } from './schema';

export type TextInputProps = Omit<TextSchema, 'type'>;

export interface TextInputDispatch {
  onChange: (text: string, error: boolean) => void;
}

interface ErrorState {
  error: boolean;
  showError: boolean;
  errorReason?: string;
}

export function getDefaultTextValue(props: TextInputProps): string {
  return props.defaultValue || '';
}

export const TextInput: FunctionComponent<
  TextInputProps & TextInputDispatch
> = (props) => {
  const [textErrorState, setTextErrorState] = useState<ErrorState>({
    error: !props.defaultValue,
    showError: false,
    errorReason: 'A value is required'
  });

  function onChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    let error = false;
    if (!newValue) {
      error = true;
      setTextErrorState({
        error,
        showError: true,
        errorReason: 'A value is required'
      });
    } else if (
      props.unavailableValues &&
      props.unavailableValues.includes(newValue)
    ) {
      error = true;
      setTextErrorState({
        error,
        showError: true,
        errorReason: `"${newValue}" has already been taken`
      });
    } else {
      setTextErrorState({
        error,
        showError: false
      });
    }
    props.onChange(newValue, error);
  }

  const { error, showError, errorReason } = textErrorState;
  return (
    <>
      {props.label && <InputLabel>{props.label}</InputLabel>}
      <TextField
        margin="dense"
        type="text"
        placeholder={props.inputPlaceholder}
        fullWidth
        defaultValue={props.defaultValue}
        error={showError}
        onChange={onChange}
      />
      {showError && <InputLabel error={error}>{errorReason}</InputLabel>}
    </>
  );
};
