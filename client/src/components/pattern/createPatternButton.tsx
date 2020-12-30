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

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { ColorType, PatternType } from '../../common/types';
import { PatternInput } from './patternInput';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }
});

export interface CreatePatternButtonProps {
  unavailablePatternNames: string[];
}

export interface CreatePatternButtonDispatch {
  createPattern: (
    name: string,
    type: PatternType,
    data: Record<string, unknown>
  ) => void;
}

export const CreatePatternButton: FunctionComponent<
  CreatePatternButtonProps & CreatePatternButtonDispatch
> = (props) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  function handleClose() {
    setOpenDialog(false);
  }
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpenDialog(true)}
      >
        <AddIcon />
      </Button>
      <PatternInput
        pattern={{
          type: PatternType.Solid,
          data: { color: { type: ColorType.HSV, hue: 0, saturation: 1 } }
        }}
        title="Create Pattern"
        confirmLabel="Create Pattern"
        unavailablePatternNames={props.unavailablePatternNames}
        open={openDialog}
        onClose={handleClose}
        onConfirm={(scene) => console.log(scene)}
      />
    </div>
  );
};
