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
import { reduce } from 'conditional-reduce';
import { Dialog, DialogValue } from '../lib/dialog';
import { SelectDialogInput } from '../lib/selectDialogInput';
import { TextDialogInput } from '../lib/textDialogInput';
import { LightType } from '../../common/types';
import { NUM_RVL_CHANNELS } from '../../common/config';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }
});

export interface CreateLightButtonDispatch {
  createRVLLight: (name: string, channel: number) => void;
  createPhilipsHueLight: (name: string) => void;
}

export function CreateLightButton(
  props: CreateLightButtonDispatch
): JSX.Element {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [lightType, setLightType] = React.useState(LightType.RVL);

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm(values: DialogValue) {
    switch (values.type) {
      case LightType.RVL:
        props.createRVLLight(values.name, parseInt(values.channel));
        break;
      case LightType.PhilipsHue:
        props.createPhilipsHueLight(values.name);
        break;
    }
    handleClose();
  }

  function handleChange(newState: DialogValue) {
    setLightType(newState.type as LightType);
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
        onChange={handleChange}
        open={openDialog}
        title="Create light"
        confirmLabel="Create light"
      >
        <SelectDialogInput
          name="type"
          description="Type of light to connect to"
          selectValues={[
            {
              value: LightType.RVL,
              label: 'RVL'
            },
            {
              value: LightType.PhilipsHue,
              label: 'Philips Hue'
            }
          ]}
          defaultValue={LightType.RVL}
        />
        <TextDialogInput
          name="name"
          description="Descriptive name for the light"
          inputPlaceholder="e.g. Left bedside tamp"
        />
        {reduce(lightType, {
          [LightType.RVL]: () => (
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
          ),
          [LightType.PhilipsHue]: () => <div></div> // We'll likely add stuff later
        })}
      </Dialog>
    </div>
  );
}
