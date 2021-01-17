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

import { makeStyles } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Theme } from '../../common/types';
import { SelectInput } from '../lib/formInputs/selectInput';
import { useContainerStyles } from '../lib/pageStyles';

const useStyles = makeStyles({
  innerContainer: {
    padding: '25px 20px'
  },
  row: {
    paddingBottom: '30px'
  }
});

export interface SettingsComponentProps {
  theme: Theme;
}

export interface SettingsComponentDispatch {
  setTheme: (theme: Theme) => void;
}

export const settingsComponent: FunctionComponent<
  SettingsComponentProps & SettingsComponentDispatch
> = (props) => {
  const classes = useContainerStyles();
  const contentClasses = useStyles();
  return (
    <div className={classes.container}>
      <div className={contentClasses.innerContainer}>
        <div className={contentClasses.row}>
          <SelectInput
            name="Theme"
            label="Theme"
            defaultValue={props.theme}
            options={[
              {
                value: Theme.Auto,
                label: Theme.Auto
              },
              {
                value: Theme.Light,
                label: Theme.Light
              },
              {
                value: Theme.Dark,
                label: Theme.Dark
              }
            ]}
            onChange={(value) => console.log(value)}
          />
        </div>
      </div>
    </div>
  );
};
