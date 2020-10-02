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

import React, { FunctionComponent } from 'react';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { InputDialog } from '../lib/inputDialog';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }
});

export interface CreateZoneButtonDispatch {
  createZone: (name: string) => void;
}

export const CreateZoneButton: FunctionComponent<CreateZoneButtonDispatch> = (
  props
) => {
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
        <Add />
      </Button>
      <InputDialog
        onConfirm={(name) => {
          handleClose();
          props.createZone(name);
        }}
        onCancel={handleClose}
        open={openDialog}
        title="Create Zone"
        description='Enter a descriptive name for the zone you wish to add, e.g.
          "kitchen," "guest bedzone", "left side bed nightstand" etc.'
        inputPlaceholder="e.g. Kitchen"
        confirmLabel="Create"
      />
    </div>
  );
};
