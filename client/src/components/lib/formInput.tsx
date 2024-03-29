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

import { makeStyles } from '@material-ui/core/styles';
import React, { PropsWithChildren, useState } from 'react';
import { ColorInput, getDefaultColorValue } from './formInputs/colorInput';
import { GroupInput } from './formInputs/groupInput';
import { getDefaultRangeValue, RangeInput } from './formInputs/rangeInput';
import { FormSchema, FormSchemaType } from './formInputs/schema';
import { getDefaultSelectValue, SelectInput } from './formInputs/selectInput';
import { TextInput, getDefaultTextValue } from './formInputs/textInput';
import { Modal } from './modal';
import { UIColor } from '../../types';

export { FormSchemaType, FormSchema } from './formInputs/schema';

const useStyles = makeStyles({
  groupContainer: {
    paddingLeft: '15px'
  },
  label: {
    paddingBottom: '20px'
  },
  row: {
    paddingBottom: '30px'
  }
});

export interface FormInputProps {
  open: boolean;
  title: string;
  schema: FormSchema[];
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
    if (name.includes(':')) {
      const [groupName, entryName] = name.split(':');
      const newValue: T = {
        ...values,
        [groupName]: {
          ...(values[groupName] as Record<string, unknown>),
          [entryName]: value
        }
      };
      setValues(newValue);
      if (props.onChange) {
        props.onChange(newValue);
      }
    } else {
      const newValue: T = {
        ...values,
        [name]: value
      };
      setValues(newValue);
      if (props.onChange) {
        props.onChange(newValue);
      }
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

  function createEntry(
    key: number,
    entryName: string,
    entry: FormSchema
  ): [input: JSX.Element, defaultValue: T[K]] {
    switch (entry.type) {
      case FormSchemaType.Select: {
        return [
          <div key={key} className={classes.row}>
            <SelectInput
              {...entry}
              onChange={(value) => onEntryChange(entryName, value)}
            />
          </div>,
          getDefaultSelectValue(entry) as T[K]
        ];
      }

      case FormSchemaType.Text: {
        initialErrorStates[entryName] = entry.defaultValue === undefined;
        return [
          <div key={key} className={classes.row}>
            <TextInput
              {...entry}
              onChange={(value, error) => {
                onErrorChange(entryName, error);
                onEntryChange(entryName, value);
              }}
            />
          </div>,
          getDefaultTextValue(entry) as T[K]
        ];
      }

      case FormSchemaType.Range: {
        return [
          <div key={key} className={classes.row}>
            <RangeInput
              {...entry}
              onChange={(value) => onEntryChange(entryName, value)}
            />
          </div>,
          getDefaultRangeValue(entry) as T[K]
        ];
      }

      case FormSchemaType.Color: {
        return [
          <div key={key} className={classes.row}>
            <ColorInput
              {...entry}
              onChange={(value) => onEntryChange(entryName, value)}
            />
          </div>,
          getDefaultColorValue(entry) as T[K]
        ];
      }

      default: {
        throw new Error(`Internal Error: unknown schema type ${entryName}`);
      }
    }
  }

  const inputs: JSX.Element[] = [];
  const defaultValues: T = {} as T;
  const initialErrorStates: Record<string, boolean> = {};
  let key = 0;
  for (let i = 0; i < props.schema.length; i++) {
    const entry = props.schema[i];
    if (entry.type === FormSchemaType.Group) {
      const groupInputs: JSX.Element[] = [];
      for (let j = 0; j < entry.entries.length; j++) {
        key++;
        const groupEntry = entry.entries[j];
        const groupEntryName = `${entry.name}:${groupEntry.name}`;
        const [input, defaultValue] = createEntry(
          key,
          groupEntryName,
          groupEntry
        );
        groupInputs.push(input);
        if (!defaultValues[entry.name]) {
          defaultValues[entry.name as K] = {} as T[K];
        }
        (defaultValues[entry.name as K] as Record<string, unknown>)[
          groupEntry.name
        ] = defaultValue;
      }
      key++;
      inputs.push(
        <GroupInput key={key} label={entry.label}>
          {groupInputs}
        </GroupInput>
      );
    } else {
      key++;
      const [input, defaultValue] = createEntry(key, entry.name, entry);
      inputs.push(input);
      defaultValues[entry.name as K] = defaultValue;
    }
  }

  const [values, setValues] = useState(defaultValues);

  let initialHasError = false;
  for (const entry in initialErrorStates) {
    initialHasError = initialHasError || initialErrorStates[entry];
  }
  const [errorMap, setErrorMap] = useState<{
    states: Record<string, boolean>;
    hasError: boolean;
  }>({ hasError: initialHasError, states: initialErrorStates });

  return (
    <Modal
      open={props.open}
      title={props.title}
      confirmColor={props.confirmColor}
      confirmLabel={props.confirmLabel}
      canConfirm={!errorMap.hasError}
      onConfirm={() => props.onConfirm(values)}
      onCancel={() => {
        if (props.onCancel) {
          props.onCancel();
        }
      }}
    >
      {inputs}
    </Modal>
  );
}
