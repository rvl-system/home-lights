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
import { FormInput, FormSchemaType } from '../lib/formInput';

const OFF = 'off';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }
});

export interface CreateLightButtonProps {
  zones: Zone[];
  unavailableLightNames: string[];
  unavailableRVLChannels: number[];
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

  function handleConfirm(values: Record<string, string>) {
    props.createRVLLight(
      values.name,
      parseInt(values.channel),
      values.zone !== OFF ? parseInt(values.zone) : undefined
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

      <FormInput
        onConfirm={handleConfirm}
        onCancel={handleClose}
        open={openDialog}
        title="Create light"
        confirmLabel="Create light"
        schema={[
          {
            type: FormSchemaType.Text,
            name: 'name',
            description: 'Descriptive name for the light',
            inputPlaceholder: 'e.g. Left bedside lamp',
            unavailableValues: props.unavailableLightNames
          },
          {
            type: FormSchemaType.Select,
            name: 'zone',
            description: 'Zone',
            options: [{ value: OFF, label: 'Unassigned' }].concat(
              props.zones.map((zone) => ({
                value: zone.id.toString(),
                label: zone.name
              }))
            ),
            defaultValue: OFF
          },
          {
            type: FormSchemaType.Select,
            name: 'channel',
            description: 'Channel',
            options: Array.from(Array(NUM_RVL_CHANNELS).keys()).map(
              (key, i) => ({
                value: i.toString(),
                label: i.toString(),
                disabled: props.unavailableRVLChannels.includes(i)
              })
            ),
            defaultValue: (() => {
              let defaultValue = 0;
              while (
                defaultValue < NUM_RVL_CHANNELS &&
                props.unavailableRVLChannels.includes(defaultValue)
              ) {
                defaultValue++;
              }
              if (defaultValue === NUM_RVL_CHANNELS) {
                // TODO: show error in UI
                throw new Error('No available RVL channels');
              }
              return defaultValue.toString();
            })()
          }
        ]}
      />
    </div>
  );
};
