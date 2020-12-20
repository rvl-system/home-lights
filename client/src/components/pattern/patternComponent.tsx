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

import { ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FunctionComponent } from 'react';
import { Pattern } from '../../common/types';
import { useContentStyles } from '../lib/pageStyles';
import {
  DeletePatternButton,
  DeletePatternButtonDispatch
} from './deletePatternButton';
import { EditPatternButtonContainer } from './editPatternButtonContainer';

const styles = makeStyles({
  caption: {
    'padding-left': '15px'
  }
});

export interface PatternComponentProps {
  pattern: Pattern;
}

export type PatternComponentDispatch = DeletePatternButtonDispatch;

export const PatternComponent: FunctionComponent<
  PatternComponentProps & PatternComponentDispatch
> = (props) => {
  const classes = styles();
  const contentClasses = useContentStyles();
  return (
    <ListItem className={contentClasses.listItem}>
      <DeletePatternButton
        pattern={props.pattern}
        className={contentClasses.leftButton}
        deletePattern={props.deletePattern}
      />
      <div>
        <Typography className={contentClasses.itemTitle}>
          {props.pattern.name}
        </Typography>
        <Typography variant="caption" className={classes.caption}>
          {props.pattern.type}
        </Typography>
      </div>
      <EditPatternButtonContainer
        className={contentClasses.rightButton}
        pattern={props.pattern}
      />
    </ListItem>
  );
};
