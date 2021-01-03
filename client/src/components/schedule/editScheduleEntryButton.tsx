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

import { Button, makeStyles } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import React, { FunctionComponent, useState } from 'react';
import { Scene, ScheduleEntry } from '../../common/types';
import { formatTime, getItem } from '../../common/util';
import { FormInput, FormSchema, FormSchemaType } from '../lib/formInput';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export interface EditScheduleEntryButtonProps {
  scheduleEntry: ScheduleEntry;
  scenes: Scene[];
  className: string;
}

export interface EditScheduleEntryButtonDispatch {
  onEdit: (scheduleEntry: ScheduleEntry) => void;
}

export const EditScheduleEntryButton: FunctionComponent<
  EditScheduleEntryButtonProps & EditScheduleEntryButtonDispatch
> = (props) => {
  const [openDialog, setOpenDialog] = useState(false);

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm(values: Record<string, string>) {
    handleClose();
    props.onEdit({
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
      defaultValue:
        props.scheduleEntry.sceneId === undefined
          ? 'off'
          : getItem(props.scheduleEntry.sceneId, props.scenes).name
    },
    {
      type: FormSchemaType.Select,
      name: 'hour',
      label: 'Hour',
      options: Array.from(Array(24).keys()).map((key, i) => ({
        value: i.toString(),
        label: i.toString()
      })),
      defaultValue: props.scheduleEntry.hour.toString()
    },
    {
      type: FormSchemaType.Select,
      name: 'minute',
      label: 'Minute',
      options: Array.from(Array(12).keys()).map((key, i) => ({
        value: (i * 5).toString(),
        label: (i * 5).toString()
      })),
      defaultValue: props.scheduleEntry.minute.toString()
    }
  ];

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Button className={props.className} onClick={() => setOpenDialog(true)}>
        <EditIcon />
      </Button>

      <FormInput
        onConfirm={handleConfirm}
        onCancel={handleClose}
        open={openDialog}
        title={`Edit ${formatTime(
          props.scheduleEntry.hour,
          props.scheduleEntry.minute
        )}`}
        confirmLabel="Save entry"
        schema={schema}
      />
    </div>
  );
};
