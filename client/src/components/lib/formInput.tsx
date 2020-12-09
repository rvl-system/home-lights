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
  Button,
  Divider as DividerSchema,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import React, { PropsWithChildren } from 'react';
import { Color } from '../../types';

export const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    'background-color': theme.palette.background.default,
    'z-index': 1,
    display: 'flex',
    'flex-direction': 'column'
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
    overflow: 'scroll'
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
    'padding-bottom': '20px'
  }
}));

export enum FormSchemaType {
  Text = 'text',
  Select = 'select',
  Range = 'range',
  Label = 'label',
  Divider = 'divider'
}

export type FormSchema =
  | TextSchema
  | SelectSchema
  | RangeSchema
  | LabelSchema
  | DividerSchema;

interface TextSchema {
  type: FormSchemaType.Text;
  name: string;
  description: string;
  defaultValue?: string;
  inputPlaceholder?: string;
}

interface SelectSchema {
  type: FormSchemaType.Select;
  name: string;
  description: string;
  defaultValue: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface RangeSchema {
  type: FormSchemaType.Range;
  name: string;
  description: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

interface LabelSchema {
  type: FormSchemaType.Label;
  label: string;
}

interface DividerSchema {
  type: FormSchemaType.Divider;
}

export interface FormInputProps {
  open: boolean;
  title: string;
  schema: FormSchema[];
  confirmLabel?: string;
  confirmColor?: Color;
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
export function FormInput<
  T extends Record<string, string | number>,
  K extends keyof T
>(
  props: PropsWithChildren<FormInputProps & FormInputDispatch<T>>
): JSX.Element | null {
  if (!props.open) {
    return null;
  }

  const classes = useStyles();

  const inputs: JSX.Element[] = [];
  const defaultValues: T = {} as T;
  for (let i = 0; i < props.schema.length; i++) {
    const entry = props.schema[i];
    switch (entry.type) {
      case FormSchemaType.Divider: {
        inputs.push(<DividerSchema key={i} />);
        break;
      }
      case FormSchemaType.Label: {
        inputs.push(
          <Typography key={i} className={classes.label} variant="h5">
            {entry.label}
          </Typography>
        );
        break;
      }
      case FormSchemaType.Select: {
        inputs.push(
          <div key={i} className={classes.row}>
            {entry.description && <InputLabel>{entry.description}</InputLabel>}
            <Select
              defaultValue={entry.defaultValue}
              onChange={(e) => {
                setValues({
                  ...values,
                  [entry.name]: e.target.value
                });
              }}
            >
              {entry.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        );
        defaultValues[entry.name as K] = (entry.defaultValue || '') as T[K];
        break;
      }
      case FormSchemaType.Text: {
        inputs.push(
          <div key={i} className={classes.row}>
            {entry.description && <InputLabel>{entry.description}</InputLabel>}
            <TextField
              autoFocus
              margin="dense"
              type="text"
              placeholder={entry.inputPlaceholder}
              fullWidth
              defaultValue={entry.defaultValue}
              onChange={(e) => {
                setValues({
                  ...values,
                  [entry.name]: e.currentTarget.value
                });
              }}
            />
          </div>
        );
        defaultValues[entry.name as K] = (entry.defaultValue || '') as T[K];
        break;
      }
      case FormSchemaType.Range: {
        const min = typeof entry.min === 'number' ? entry.min : 0;
        const max = typeof entry.max === 'number' ? entry.max : 100;
        const defaultValue =
          typeof entry.defaultValue === 'number' ? entry.defaultValue : max;
        inputs.push(
          <div key={i} className={classes.row}>
            {entry.description && <InputLabel>{entry.description}</InputLabel>}
            <Slider
              defaultValue={defaultValue}
              valueLabelDisplay="auto"
              step={entry.step || 1}
              min={min}
              max={max}
              onChange={(e, newValue) => {
                setValues({
                  ...values,
                  [entry.name]: newValue
                });
              }}
            />
          </div>
        );
        defaultValues[entry.name as K] = (entry.defaultValue || 0) as T[K];
        break;
      }
    }
  }

  const [values, setValues] = React.useState(defaultValues);

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
