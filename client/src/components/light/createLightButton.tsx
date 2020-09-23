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
import { Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { reduce } from 'conditional-reduce';
import { Dialog, DialogValue } from '../lib/dialog';
import { SelectDialogInput } from '../lib/selectDialogInput';
import { LightType } from '../../common/types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }
});

export interface CreateLightButtonDispatch {
  createRVLLight: (name: string, channel: number) => void;
  createHueLight: (name: string) => void;
}

export function CreateLightButton(
  props: CreateLightButtonDispatch
): JSX.Element {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [lightType, setLightType] = React.useState(LightType.rvl);

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm(values: DialogValue) {
    switch (values.type) {
      case LightType.rvl:
        props.createRVLLight(values.name, parseInt(values.channel));
        break;
      case LightType.hue:
        props.createHueLight(values.name);
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
        <Add />
      </Button>
      <Dialog
        onConfirm={handleConfirm}
        onCancel={handleClose}
        onChange={handleChange}
        open={openDialog}
        title="Create Zone"
        description='Enter a descriptive name for the zone you wish to add. A zone in
          Home Lights represents a physical area in your home, e.g.
          "kitchen," "guest bedzone", "left side bed nightstand" etc. The zone name
          must not already be in use.'
        confirmLabel="Create"
      >
        <SelectDialogInput
          name="type"
          description="The type of light to connect to"
          selectValues={[
            {
              value: LightType.rvl,
              label: 'RVL'
            },
            {
              value: LightType.hue,
              label: 'Phillips Hue'
            }
          ]}
          defaultValue={LightType.rvl}
        />
        {reduce(lightType, {
          [LightType.rvl]: () => <div>RVL</div>,
          [LightType.hue]: () => <div>Phillips Hue</div>
        })}
      </Dialog>
    </div>
  );
}
