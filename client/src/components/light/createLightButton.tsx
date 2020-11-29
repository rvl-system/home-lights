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
import { NUM_RVL_CHANNELS } from '../../common/config';
import { Zone } from '../../common/types';
import { DialogComponent, DialogValue } from '../lib/dialogComponent';
import { SelectDialogInput } from '../lib/selectDialogInput';
import { TextDialogInput } from '../lib/textDialogInput';

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
  createRVLLight: (name: string, channel: number, zone?: number) => void;
}

export const CreateLightButton: FunctionComponent<
  CreateLightButtonProps & CreateLightButtonDispatch
> = (props) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm(values: DialogValue) {
    props.createRVLLight(
      values.name as string,
      values.channel as number,
      values.zone !== -1 ? (values.zone as number) : undefined
    );
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
      <DialogComponent
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
          name="zone"
          description="Zone"
          selectValues={[{ value: -1, label: 'Unassigned' }].concat(
            props.zones.map((zone) => ({
              value: zone.id,
              label: zone.name
            }))
          )}
          defaultValue={-1}
        />
        <SelectDialogInput
          name="channel"
          description="Channel"
          selectValues={Array.from(Array(NUM_RVL_CHANNELS).keys()).map(
            (key, i) => ({
              value: i,
              label: i.toString()
            })
          )}
          defaultValue={0}
        />
      </DialogComponent>
    </div>
  );
};
