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

import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import React, { PropsWithChildren, useState } from 'react';
import { UIColor } from '../../types';
import { ColorInput, getDefaultColorValue } from './formInputs/colorInput';
import { getDefaultRangeValue, RangeInput } from './formInputs/rangeInput';
import { FormSchema, FormSchemaType } from './formInputs/schema';
import { getDefaultSelectValue, SelectInput } from './formInputs/selectInput';
import { TextInput, getDefaultTextValue } from './formInputs/textInput';

export { FormSchemaType, FormSchema } from './formInputs/schema';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    'background-color': theme.palette.background.default,
    'z-index': 1,
    display: 'flex',
    'flex-direction': 'column',

    // I wonder why the TypeScript definitions don't recognize "standalone"?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddingBottom: (window.navigator as any).standalone ? '20px' : 'inherit'
  },
  header: {
    display: 'flex',
    'flex-direction': 'row',
    'padding-top': '20px',
    'padding-bottom': '20px'
  },
  backButton: {},
  title: {
    display: 'flex',
    'align-items': 'center'
  },
  content: {
    'flex-grow': 1,
    padding: '20px',
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  label: {
    'padding-bottom': '20px'
  },
  row: {
    'padding-bottom': '30px'
  },
  footer: {
    display: 'flex',
    'justify-content': 'center',
    'padding-top': '20px',
    'padding-bottom': '20px',
    minHeight: '75px'
  }
}));

export interface FormInputProps {
  open: boolean;
  title: string;
  schema: FormSchema;
  confirmLabel?: string;
  confirmColor?: UIColor;
}

export interface FormInputDispatch<T> {
  onConfirm: (newValue: T) => void;
  onChange?: (newValue: T) => void;
  onCancel?: () => void;
}

// Normally we'd use a function expression like we do elsewhere, but we can't
// pass the type generic around if we did, so we have to use a function
// declaration instead
// eslint-disable-next-line @typescript-eslint/naming-convention
export function FormInput<T extends Record<string, unknown>, K extends keyof T>(
  props: PropsWithChildren<FormInputProps & FormInputDispatch<T>>
): JSX.Element | null {
  if (!props.open) {
    return null;
  }

  const classes = useStyles();

  function onEntryChange(name: string, value: unknown) {
    const newValue: T = {
      ...values,
      [name]: value
    };
    setValues(newValue);
    if (props.onChange) {
      props.onChange(newValue);
    }
  }

  function onErrorChange(name: string, error: boolean) {
    errorMap.states[name] = error;
    let hasError = false;
    for (const entry in errorMap.states) {
      hasError = hasError || errorMap.states[entry];
    }
    setErrorMap({
      hasError,
      states: errorMap.states
    });
  }

  const inputs: JSX.Element[] = [];
  const defaultValues: T = {} as T;
  const initialErrorStates: Record<string, boolean> = {};
  let i = 0;
  for (const entryName in props.schema) {
    i++;
    const entry = props.schema[entryName];
    switch (entry.type) {
      case FormSchemaType.Select: {
        inputs.push(
          <div key={i} className={classes.row}>
            <SelectInput
              {...entry}
              onChange={(value) => onEntryChange(entryName, value)}
            />
          </div>
        );
        defaultValues[entryName as K] = getDefaultSelectValue(entry) as T[K];
        break;
      }

      case FormSchemaType.Text: {
        initialErrorStates[entryName] = entry.defaultValue === undefined;
        inputs.push(
          <div key={i} className={classes.row}>
            <TextInput
              {...entry}
              onChange={(value, error) => {
                onErrorChange(entryName, error);
                onEntryChange(entryName, value);
              }}
            />
          </div>
        );
        defaultValues[entryName as K] = getDefaultTextValue(entry) as T[K];
        break;
      }

      case FormSchemaType.Range: {
        inputs.push(
          <div key={i} className={classes.row}>
            <RangeInput
              {...entry}
              onChange={(value) => onEntryChange(entryName, value)}
            />
          </div>
        );
        defaultValues[entryName as K] = getDefaultRangeValue(entry) as T[K];
        break;
      }

      case FormSchemaType.Color: {
        inputs.push(
          <div key={i} className={classes.row}>
            <ColorInput
              {...entry}
              onChange={(value) => onEntryChange(entryName, value)}
            />
          </div>
        );
        defaultValues[entryName as K] = getDefaultColorValue(entry) as T[K];
        break;
      }
    }
  }

  const [values, setValues] = React.useState(defaultValues);

  let initialHasError = false;
  for (const entry in initialErrorStates) {
    initialHasError = initialHasError || initialErrorStates[entry];
  }
  const [errorMap, setErrorMap] = useState<{
    states: Record<string, boolean>;
    hasError: boolean;
  }>({ hasError: initialHasError, states: initialErrorStates });

  return (
    <div className={classes.container} onClick={(e) => e.stopPropagation()}>
      <div className={classes.header}>
        <div className={classes.backButton}>
          <Button
            color="default"
            onClick={() => {
              if (props.onCancel) {
                props.onCancel();
              }
            }}
          >
            <ArrowBackIcon />
          </Button>
        </div>
        <div className={classes.title}>
          {props.title && <Typography>{props.title}</Typography>}
        </div>
      </div>
      <div className={classes.content}>{inputs}</div>
      <div className={classes.footer}>
        <Button
          variant="contained"
          color={props.confirmColor || 'primary'}
          disabled={errorMap.hasError}
          onClick={() => {
            props.onConfirm(values);
          }}
        >
          {props.confirmLabel || 'Confirm'}
        </Button>
      </div>
    </div>
  );
}
