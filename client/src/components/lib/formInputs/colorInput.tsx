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
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { reduce } from 'conditional-reduce';
import React, { FunctionComponent, useState } from 'react';
import { Color, ColorType } from '../../../common/types';
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
  White = 'White',
  History = 'History'
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
            style={{ backgroundColor: `hsl(${0}, ${100}%, 50%)` }}
          ></span>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
      </div>
      {expanded && (
        <div className={classes.contentContainer}>
          <ToggleButtonGroup
            value={selectedTab}
            exclusive
            onChange={(e, value) => setSelectedTab(value)}
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
            <ToggleButton
              value={SelectedTab.History}
              className={classes.inputTypeButton}
            >
              History
            </ToggleButton>
          </ToggleButtonGroup>
          {reduce(selectedTab, {
            [SelectedTab.Color]: () => (
              <ColorSelect
                defaultColor={defaultColor}
                onChange={props.onChange}
              />
            ),
            [SelectedTab.White]: () => (
              <WhiteSelect
                defaultColor={defaultColor}
                onChange={props.onChange}
              />
            ),
            [SelectedTab.History]: () => (
              <HistorySelect
                defaultColor={defaultColor}
                onChange={props.onChange}
              />
            )
          })}
        </div>
      )}
    </>
  );
};

interface SelectProps {
  defaultColor: Color;
  onChange: (color: Color) => void;
}

const ColorSelect: FunctionComponent<SelectProps> = (props) => {
  return <div>Color</div>;
};

const WhiteSelect: FunctionComponent<SelectProps> = (props) => {
  return <div>White</div>;
};

const HistorySelect: FunctionComponent<SelectProps> = (props) => {
  return <div>History</div>;
};
