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

import * as React from 'react';
import { Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogValue } from '../lib/dialog';
import { SelectDialogInput } from '../lib/selectDialogInput';
import { TextDialogInput } from '../lib/textDialogInput';
import { NUM_RVL_CHANNELS } from '../../common/config';
import { Zone } from '../../common/types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }
});

export interface CreateLightButtonProps {
  zones: Zone[];
}

export interface CreateLightButtonDispatch {
  createRVLLight: (name: string, channel: number) => void;
}

export function CreateLightButton(
  props: CreateLightButtonProps & CreateLightButtonDispatch
): JSX.Element {
  const [openDialog, setOpenDialog] = React.useState(false);

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm(values: DialogValue) {
    props.createRVLLight(values.name, parseInt(values.channel));
    handleClose();
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
      <Dialog
        onConfirm={handleConfirm}
        onCancel={handleClose}
        open={openDialog}
        title="Create light"
        confirmLabel="Create light"
      >
        <TextDialogInput
          name="name"
          description="Descriptive name for the light"
          inputPlaceholder="e.g. Left bedside lamp"
        />
        <SelectDialogInput
          name="channel"
          description="Channel"
          selectValues={Array.from(Array(NUM_RVL_CHANNELS).keys()).map(
            (_, i) => ({
              value: i.toString(),
              label: i.toString()
            })
          )}
          defaultValue={'0'}
        />
      </Dialog>
    </div>
  );
}
