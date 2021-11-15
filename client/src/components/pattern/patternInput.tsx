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
import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Color,
  ColorCyclePattern,
  ColorType,
  Pattern,
  PatternType,
  PulsePattern,
  RainbowPattern,
  SolidPattern,
  WavePattern
} from '../../common/types';
import { FormInput, FormSchema, FormSchemaType } from '../lib/formInput';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
  const [pattern, setPattern] = useState(props.pattern);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setPattern(props.pattern);
  }, [props.pattern]);

  function handleConfirm(values: Record<string, unknown>) {
    let data: Record<string, unknown>;
    switch (values.type) {
      case PatternType.Solid: {
        const patternData: SolidPattern['data'] = {
          color: values.color as Color
        };
        data = patternData;
        break;
      }
      case PatternType.Wave: {
        const patternData: WavePattern['data'] = {
          rate: values.rate as number,
          waveColor: values.waveColor as Color,
          foregroundColor: values.foregroundColor as Color,
          backgroundColor: values.backgroundColor as Color,
          distancePeriod: values.distancePeriod as number
        };
        data = patternData;
        break;
      }
      case PatternType.ColorCycle: {
        const patternData: ColorCyclePattern['data'] = {
          rate: values.rate as number
        };
        data = patternData;
        break;
      }
      case PatternType.Pulse: {
        const patternData: PulsePattern['data'] = {
          rate: values.rate as number,
          color: values.color as Color
        };
        data = patternData;
        break;
      }
      case PatternType.Rainbow: {
        const patternData: RainbowPattern['data'] = {
          rate: values.rate as number,
          distancePeriod: values.distancePeriod as number
        };
        data = patternData;
        break;
      }
      default: {
        throw new Error(`Internal Error: unknown pattern type ${values.type}`);
      }
    }
    props.onConfirm(values.name as string, values.type as PatternType, data);
    props.onClose();
  }

  const schema: FormSchema[] = [
    {
      type: FormSchemaType.Text,
      name: 'name',
      label: 'Descriptive name for the pattern',
      inputPlaceholder: 'e.g. Purple Rainbow',
      unavailableValues: props.unavailablePatternNames,
      defaultValue: props.pattern.name
    },
    {
      type: FormSchemaType.Select,
      name: 'type',
      label: 'Pattern type',
      options: [
        { value: PatternType.Solid, label: PatternType.Solid },
        { value: PatternType.Wave, label: PatternType.Wave },
        { value: PatternType.ColorCycle, label: PatternType.ColorCycle },
        { value: PatternType.Pulse, label: PatternType.Pulse },
        { value: PatternType.Rainbow, label: PatternType.Rainbow }
      ],
      defaultValue: pattern.type
    }
  ];

  switch (pattern.type) {
    case PatternType.Solid: {
      const solidPattern = pattern as SolidPattern;
      schema.push({
        type: FormSchemaType.Color,
        name: 'color',
        label: 'Color',
        defaultValue: solidPattern.data.color
      });
      break;
    }

    case PatternType.Wave: {
      const wavePattern = pattern as WavePattern;
      schema.push({
        type: FormSchemaType.Range,
        name: 'rate',
        label: 'Rate',
        defaultValue: wavePattern.data.rate,
        min: 0,
        max: 32,
        step: 1
      });
      schema.push({
        type: FormSchemaType.Range,
        name: 'distancePeriod',
        label: 'Spacing',
        defaultValue: wavePattern.data.distancePeriod,
        min: 8,
        max: 128,
        step: 8
      });
      schema.push({
        type: FormSchemaType.Color,
        name: 'waveColor',
        label: 'Wave Color',
        defaultValue: wavePattern.data.waveColor
      });
      schema.push({
        type: FormSchemaType.Color,
        name: 'foregroundColor',
        label: 'Foreground Color',
        defaultValue: wavePattern.data.foregroundColor
      });
      schema.push({
        type: FormSchemaType.Color,
        name: 'backgroundColor',
        label: 'Background Color',
        defaultValue: wavePattern.data.backgroundColor
      });
      break;
    }

    case PatternType.ColorCycle: {
      const colorCyclePattern = pattern as ColorCyclePattern;
      schema.push({
        type: FormSchemaType.Range,
        name: 'rate',
        label: 'Rate',
        defaultValue: colorCyclePattern.data.rate,
        min: 0,
        max: 32,
        step: 1
      });
      break;
    }

    case PatternType.Pulse: {
      const pulsePattern = pattern as PulsePattern;
      schema.push({
        type: FormSchemaType.Range,
        name: 'rate',
        label: 'Rate',
        defaultValue: pulsePattern.data.rate,
        min: 0,
        max: 32,
        step: 1
      });
      schema.push({
        type: FormSchemaType.Color,
        name: 'color',
        label: 'Color',
        defaultValue: pulsePattern.data.color
      });
      break;
    }

    case PatternType.Rainbow: {
      const rainbowPattern = pattern as RainbowPattern;
      schema.push({
        type: FormSchemaType.Range,
        name: 'rate',
        label: 'Rate',
        defaultValue: rainbowPattern.data.rate,
        min: 0,
        max: 32,
        step: 1
      });
      schema.push({
        type: FormSchemaType.Range,
        name: 'distancePeriod',
        label: 'Spacing',
        defaultValue: rainbowPattern.data.distancePeriod,
        min: 8,
        max: 128,
        step: 8
      });
      break;
    }
  }

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <FormInput
        key={key}
        onConfirm={handleConfirm}
        onCancel={props.onClose}
        onChange={(updatedPattern) => {
          const updatedPatternType = updatedPattern.type as PatternType;
          if (updatedPatternType !== pattern.type) {
            setKey(key + 1); // Force a complete re-render of the form input by changing the key
            switch (updatedPatternType) {
              case PatternType.Solid: {
                const updatedPattern: Omit<SolidPattern, 'id' | 'name'> = {
                  type: PatternType.Solid,
                  data: {
                    color: {
                      type: ColorType.HSV,
                      hue: 0,
                      saturation: 1
                    }
                  }
                };
                setPattern(updatedPattern);
                break;
              }
              case PatternType.Wave: {
                const updatedPattern: Omit<WavePattern, 'id' | 'name'> = {
                  type: PatternType.Wave,
                  data: {
                    rate: 4,
                    waveColor: {
                      type: ColorType.HSV,
                      hue: 0,
                      saturation: 1
                    },
                    foregroundColor: {
                      type: ColorType.HSV,
                      hue: 120,
                      saturation: 1
                    },
                    backgroundColor: {
                      type: ColorType.HSV,
                      hue: 240,
                      saturation: 1
                    },
                    distancePeriod: 32
                  }
                };
                setPattern(updatedPattern);
                break;
              }
              case PatternType.ColorCycle: {
                const updatedPattern: Omit<ColorCyclePattern, 'id' | 'name'> = {
                  type: PatternType.ColorCycle,
                  data: {
                    rate: 4
                  }
                };
                setPattern(updatedPattern);
                break;
              }
              case PatternType.Pulse: {
                const updatedPattern: Omit<PulsePattern, 'id' | 'name'> = {
                  type: PatternType.Pulse,
                  data: {
                    rate: 4,
                    color: {
                      type: ColorType.HSV,
                      hue: 0,
                      saturation: 1
                    }
                  }
                };
                setPattern(updatedPattern);
                break;
              }
              case PatternType.Rainbow: {
                const updatedPattern: Omit<RainbowPattern, 'id' | 'name'> = {
                  type: PatternType.Rainbow,
                  data: {
                    rate: 4,
                    distancePeriod: 32
                  }
                };
                setPattern(updatedPattern);
                break;
              }
            }
          }
        }}
        open={props.open}
        title={props.title}
        confirmLabel={props.confirmLabel}
        schema={schema}
      />
    </div>
  );
};
