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

import { Button, InputLabel, Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { reduce } from 'conditional-reduce';
import React, { FunctionComponent, useState } from 'react';
import {
  Color,
  ColorType,
  HSVColor,
  TemperatureColor
} from '../../../common/types';
import { getHSVColor } from '../../../common/util';
import { ColorSchema } from './schema';

export const useStyles = makeStyles({
  expandButton: {
    width: '5em',
    height: '2em',
    marginRight: '1em'
  },
  expandContainer: {
    marginTop: '7px'
  },
  contentContainer: {
    marginTop: '10px'
  },
  inputTypeContainer: {
    width: '100%',
    display: 'flex'
  },
  inputTypeButton: {
    flexGrow: 1
  },
  inputContainer: {
    marginTop: '10px'
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

enum SelectedTab {
  Color = 'Color',
  White = 'White'
}

export const ColorInput: FunctionComponent<
  ColorInputProps & ColorInputDispatch
> = (props) => {
  const classes = useStyles();

  const defaultColor = getDefaultColorValue(props);
  const [expanded, setExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState(
    defaultColor.type === ColorType.HSV ? SelectedTab.Color : SelectedTab.White
  );
  const [colors, setColors] = useState<Record<SelectedTab, Color>>({
    [SelectedTab.Color]:
      defaultColor.type === ColorType.HSV
        ? defaultColor
        : { type: ColorType.HSV, hue: 0, saturation: 1 },
    [SelectedTab.White]:
      defaultColor.type === ColorType.Temperature
        ? defaultColor
        : { type: ColorType.Temperature, temperature: 3000 }
  });

  const currentColor = getHSVColor(colors[selectedTab]);

  return (
    <>
      {props.description && <InputLabel>{props.description}</InputLabel>}
      <div>
        <Button
          variant="outlined"
          className={classes.expandContainer}
          onClick={() => setExpanded(!expanded)}
        >
          <span
            className={classes.expandButton}
            style={{
              backgroundColor: `hsl(${currentColor.hue}, ${Math.round(
                currentColor.saturation * 100
              )}%, 50%)`
            }}
          ></span>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
      </div>
      {expanded && (
        <div className={classes.contentContainer}>
          <ToggleButtonGroup
            value={selectedTab}
            exclusive
            onChange={(e, value) => {
              setSelectedTab(value);
              props.onChange(colors[value as SelectedTab]);
            }}
            className={classes.inputTypeContainer}
          >
            <ToggleButton
              value={SelectedTab.Color}
              className={classes.inputTypeButton}
            >
              Color
            </ToggleButton>
            <ToggleButton
              value={SelectedTab.White}
              className={classes.inputTypeButton}
            >
              White
            </ToggleButton>
          </ToggleButtonGroup>
          <div className={classes.inputContainer}>
            {reduce(selectedTab, {
              [SelectedTab.Color]: () => (
                <ColorSelect
                  color={colors[SelectedTab.Color] as HSVColor}
                  onChange={(color) => {
                    colors[SelectedTab.Color] = color;
                    setColors(colors);
                    props.onChange(color);
                  }}
                />
              ),
              [SelectedTab.White]: () => (
                <WhiteSelect
                  color={colors[SelectedTab.White] as TemperatureColor}
                  onChange={(color) => {
                    colors[SelectedTab.White] = color;
                    setColors(colors);
                    props.onChange(color);
                  }}
                />
              )
            })}
          </div>
        </div>
      )}
    </>
  );
};

interface ColorSelectProps {
  color: HSVColor;
  onChange: (color: HSVColor) => void;
}

const ColorSelect: FunctionComponent<ColorSelectProps> = (props) => {
  return <div>{JSON.stringify(props.color)}</div>;
};

interface WhiteSelectProps {
  color: TemperatureColor;
  onChange: (color: TemperatureColor) => void;
}

const WhiteSelect: FunctionComponent<WhiteSelectProps> = (props) => {
  const marks = [
    {
      value: 3000,
      label: 'Warm'
    },
    {
      value: 4000,
      label: 'Neutral'
    },
    {
      value: 5000,
      label: 'Cool'
    }
  ];
  return (
    <>
      <InputLabel>Temperature</InputLabel>
      <Slider
        min={2000}
        max={6000}
        step={100}
        marks={marks}
        valueLabelDisplay="auto"
        value={props.color.temperature}
        onChange={(e, newValue) =>
          props.onChange({
            type: ColorType.Temperature,
            temperature: newValue as number
          })
        }
      />
    </>
  );
};
