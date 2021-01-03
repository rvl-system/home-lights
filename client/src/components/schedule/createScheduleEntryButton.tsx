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
import React, { FunctionComponent, useState } from 'react';
import { Scene, ScheduleEntry } from '../../common/types';
import { FormInput, FormSchema, FormSchemaType } from '../lib/formInput';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: '100%'
  }
});

export interface CreateScheduleEntryButtonProps {
  scenes: Scene[];
}

export interface CreateScheduleEntryButtonDispatch {
  onConfirm: (scheduleEntry: ScheduleEntry) => void;
}

export const CreateScheduleEntryButton: FunctionComponent<
  CreateScheduleEntryButtonProps & CreateScheduleEntryButtonDispatch
> = (props) => {
  const [openDialog, setOpenDialog] = useState(false);

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm(values: Record<string, string>) {
    handleClose();
    props.onConfirm({
      sceneId: values.sceneId === 'off' ? undefined : parseInt(values.sceneId),
      hour: parseInt(values.hour),
      minute: parseInt(values.minute)
    });
  }

  const schema: FormSchema[] = [
    {
      type: FormSchemaType.Select,
      name: 'sceneId',
      label: 'Scene',
      options: [{ value: 'off', label: 'Off' }].concat(
        props.scenes.map((scene) => ({
          value: scene.id.toString(),
          label: scene.name
        }))
      ),
      defaultValue: 'off'
    },
    {
      type: FormSchemaType.Select,
      name: 'hour',
      label: 'Hour',
      options: Array.from(Array(24).keys()).map((key, i) => ({
        value: i.toString(),
        label: i.toString()
      })),
      defaultValue: '0'
    },
    {
      type: FormSchemaType.Select,
      name: 'minute',
      label: 'Minute',
      options: Array.from(Array(12).keys()).map((key, i) => ({
        value: (i * 5).toString(),
        label: (i * 5).toString()
      })),
      defaultValue: '0'
    }
  ];

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpenDialog(true)}
        className={classes.button}
      >
        <AddIcon />
      </Button>

      <FormInput
        onConfirm={handleConfirm}
        onCancel={handleClose}
        open={openDialog}
        title={'Create schedule entry'}
        confirmLabel="Save schedule entry"
        schema={schema}
      />
    </div>
  );
};
