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

import { Divider, List } from '@material-ui/core';
import React, { Fragment, FunctionComponent } from 'react';
import { CreatePatternButtonContainer } from './createPatternButtonContainer';
import { PatternComponent, PatternComponentDispatch } from './patternComponent';
import { Pattern } from '../../common/types';
import { useContainerStyles } from '../lib/pageStyles';

export interface PatternsTabProps {
  patterns: Pattern[];
}

export type PatternsTabDispatch = PatternComponentDispatch;

export const PatternsTab: FunctionComponent<
  PatternsTabProps & PatternsTabDispatch
> = (props) => {
  const classes = useContainerStyles();
  return (
    <div className={classes.container}>
      <div className={classes.altHeader}>
        <CreatePatternButtonContainer />
      </div>
      <div className={classes.content}>
        <div className={classes.innerContent}>
          <List>
            {props.patterns.map((pattern) => (
              <Fragment key={pattern.id}>
                <Divider />
                <PatternComponent
                  pattern={pattern}
                  deletePattern={props.deletePattern}
                />
              </Fragment>
            ))}
            <Divider />
          </List>
        </div>
      </div>
    </div>
  );
};
