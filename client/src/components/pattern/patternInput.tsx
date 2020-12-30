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
import React, { FunctionComponent, useState } from 'react';
import { Pattern, PatternType, SolidPattern } from '../../common/types';
import { FormInput, FormSchema, FormSchemaType } from '../lib/formInput';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }
});

export interface PatternInputProps {
  pattern: Omit<Pattern, 'id' | 'name'> & { name?: string };
  title: string;
  confirmLabel: string;
  open: boolean;
  unavailablePatternNames: string[];
}

export interface PatternInputDispatch {
  onClose: () => void;
  onConfirm: (
    name: string,
    type: PatternType,
    data: Record<string, unknown>
  ) => void;
}

export const PatternInput: FunctionComponent<
  PatternInputProps & PatternInputDispatch
> = (props) => {
  function handleConfirm(values: Record<string, string>) {
    switch (values.type) {
      case PatternType.Solid: {
        props.onConfirm(values.name, values.type, { color: values.color });
        break;
      }
    }
    props.onClose();
  }

  const [patternType, setPatternType] = useState(props.pattern.type);

  const schema: FormSchema[] = [
    {
      type: FormSchemaType.Text,
      name: 'name',
      description: 'Descriptive name for the pattern',
      inputPlaceholder: 'e.g. Purple Rainbow',
      unavailableValues: props.unavailablePatternNames,
      defaultValue: props.pattern.name
    },
    {
      type: FormSchemaType.Select,
      name: 'type',
      description: 'Pattern type',
      options: [
        { value: PatternType.Solid, label: PatternType.Solid },
        { value: PatternType.Wave, label: PatternType.Wave },
        { value: PatternType.ColorCycle, label: PatternType.ColorCycle },
        { value: PatternType.Pulse, label: PatternType.Pulse },
        { value: PatternType.Rainbow, label: PatternType.Rainbow }
      ],
      defaultValue: patternType
    }
  ];
  switch (patternType) {
    case PatternType.Solid: {
      const pattern = props.pattern as SolidPattern;
      schema.push({
        type: FormSchemaType.Color,
        name: 'color',
        description: 'Color',
        defaultValue: pattern.data.color
      });
      break;
    }
    case PatternType.Wave: {
      break;
    }
    case PatternType.ColorCycle: {
      break;
    }
    case PatternType.Pulse: {
      break;
    }
    case PatternType.Wave: {
      break;
    }
  }

  function onChange(updatedPattern: Pattern) {
    if (updatedPattern.type !== patternType) {
      setPatternType(updatedPattern.type);
    }
  }

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <FormInput
        onConfirm={handleConfirm}
        onCancel={props.onClose}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={onChange as any}
        open={props.open}
        title={props.title}
        confirmLabel={props.confirmLabel}
        schema={schema}
      />
    </div>
  );
};
