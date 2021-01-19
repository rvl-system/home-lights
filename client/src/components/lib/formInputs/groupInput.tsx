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

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FunctionComponent } from 'react';
export { FormSchemaType, FormSchema } from './schema';

const useStyles = makeStyles({
  groupContainer: {
    paddingLeft: '15px'
  },
  label: {
    paddingBottom: '20px'
  }
});

export interface GroupInputProps {
  label: string;
}

export const GroupInput: FunctionComponent<GroupInputProps> = (props) => {
  const classes = useStyles();
  return (
    <div>
      <Typography className={classes.label} variant="h5">
        {props.label}
      </Typography>
      <div className={classes.groupContainer}>{props.children}</div>
    </div>
  );
};
