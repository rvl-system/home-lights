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
  ExpandMore as ExpandMoreIcon,
  Adjust as AdjustIcon
} from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { hsv2hsl, hsv2rgb, rgb2hsv } from '@swiftcarrot/color-fns';
import { reduce } from 'conditional-reduce';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { throttle } from 'throttle-debounce';
import {
  Color,
  ColorType,
  HSVColor,
  TemperatureColor
} from '../../../common/types';
import { getHSVColor } from '../../../common/util';
import { ColorSchema } from './schema';

const WHEEL_DIAMETER = 300;

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
  },
  wheelContainer: {
    display: 'flex',
    justifyContent: 'center',
    touchAction: 'none',
    position: 'relative',
    marginTop: '25px',
    marginBottom: '10px'
  },
  wheelPin: {
    position: 'absolute',
    color: 'black',
    fontSize: '48px'
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
  const hsl = hsv2hsl(
    currentColor.hue,
    Math.round(currentColor.saturation * 100),
    100
  );

  useEffect(() => {
    if (expanded) {
      ref.current?.scrollIntoView(true);
    }
  }, [expanded]);

  const ref = useRef<HTMLDivElement>(null);
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
              backgroundColor: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
            }}
          ></span>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
      </div>
      {expanded && (
        <div className={classes.contentContainer} ref={ref}>
          <ToggleButtonGroup
            value={selectedTab}
            exclusive
            onChange={(e, value) => {
              if (value !== null) {
                setSelectedTab(value);
                props.onChange(colors[value as SelectedTab]);
              }
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
  const classes = useStyles();
  const wheelRef = useRef<HTMLCanvasElement>(null);

  const s = (props.color.saturation * WHEEL_DIAMETER) / 2;
  const t = (props.color.hue * 2 * Math.PI) / 360;
  const colorCoordinates = {
    left: -s * Math.cos(t) + WHEEL_DIAMETER / 2 - 6,
    top: -s * Math.sin(t) + WHEEL_DIAMETER / 2 - 24
  };

  useEffect(() => {
    const canvas = wheelRef.current;
    if (!canvas) {
      throw new Error('Internal Error: canvas ref is unexpectedly null');
    }
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Internal Error: canvas context is unexpectedly null');
    }
    const radius = Math.floor(context.canvas.width / 2);
    const { width, height } = context.canvas;
    const imageData = context.createImageData(width, height);
    for (let x = -radius; x < radius; x++) {
      for (let y = -radius; y < radius; y++) {
        const theta = Math.atan2(y, x);
        const hue = (theta * 180) / Math.PI + 180;
        const saturation = Math.sqrt(x * x + y * y) / radius;
        const { r, g, b } = hsv2rgb(hue, saturation * 100, 100);
        if (saturation < 1) {
          imageData.data[(y + radius) * width * 4 + (x + radius) * 4] = r;
          imageData.data[(y + radius) * width * 4 + (x + radius) * 4 + 1] = g;
          imageData.data[(y + radius) * width * 4 + (x + radius) * 4 + 2] = b;
          imageData.data[(y + radius) * width * 4 + (x + radius) * 4 + 3] = 255;
        }
      }
    }
    context.putImageData(imageData, 0, 0);
  }, []);

  const handleMove = throttle(33, (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    const canvas = wheelRef.current;
    if (!canvas) {
      throw new Error('Internal Error: canvas ref is unexpectedly null');
    }
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Internal Error: canvas context is unexpectedly null');
    }
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.targetTouches[0].clientX - rect.left);
    const y = Math.round(e.targetTouches[0].clientY - rect.top);
    const { data } = context.getImageData(x, y, 1, 1);
    if (data[3] !== 255) {
      const radius = Math.round(context.canvas.width / 2);
      const hue = (Math.atan2(y - radius, x - radius) * 180) / Math.PI + 180;
      props.onChange({
        type: ColorType.HSV,
        hue,
        saturation: 1
      });
      return;
    }
    const { h: hue, s: saturation } = rgb2hsv(data[0], data[1], data[2]);
    props.onChange({
      type: ColorType.HSV,
      hue,
      saturation: saturation / 100
    });
  });

  return (
    <>
      <div className={classes.wheelContainer}>
        <canvas
          ref={wheelRef}
          width={WHEEL_DIAMETER}
          height={WHEEL_DIAMETER}
          onTouchMove={handleMove}
          onTouchStart={handleMove}
        />
        <AdjustIcon className={classes.wheelPin} style={colorCoordinates} />
      </div>
      <InputLabel>Hue</InputLabel>
      <Slider
        min={0}
        max={360}
        step={1}
        valueLabelDisplay="auto"
        value={props.color.hue}
        onChange={(e, newValue) =>
          props.onChange({
            type: ColorType.HSV,
            hue: newValue as number,
            saturation: props.color.saturation
          })
        }
      />
      <InputLabel>Saturation</InputLabel>
      <Slider
        min={0}
        max={1}
        step={0.01}
        valueLabelDisplay="auto"
        value={props.color.saturation}
        onChange={(e, newValue) =>
          props.onChange({
            type: ColorType.HSV,
            hue: props.color.hue,
            saturation: newValue as number
          })
        }
      />
    </>
  );
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
