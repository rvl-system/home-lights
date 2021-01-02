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
import { MAX_BRIGHTNESS, BRIGHTNESS_STEP } from '../../common/config';
import { Light, Pattern, SceneLightEntry } from '../../common/types';
import { getItem } from '../../common/util';
import { FormInput, FormSchema, FormSchemaType } from '../lib/formInput';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  },
  button: {
    width: '100%'
  }
});

export interface CreateSceneButtonProps {
  zoneId: number;
  patterns: Pattern[];
  lights: Light[];
  unavailableSceneNames: string[];
}

export interface CreateSceneButtonDispatch {
  createScene: (name: string, lights: SceneLightEntry[]) => void;
}

export const CreateSceneButton: FunctionComponent<
  CreateSceneButtonProps & CreateSceneButtonDispatch
> = (props) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm(values: Record<string, string>) {
    handleClose();
    const lights: SceneLightEntry[] = [];
    for (const value in values) {
      const match = /^pattern-([0-9]*)$/.exec(value);
      if (match) {
        lights.push({
          lightId: parseInt(match[1]),
          patternId:
            values[value] === 'off' ? undefined : parseInt(values[value]),
          brightness: 0
        });
      }
    }

    for (const value in values) {
      const match = /^brightness-([0-9]*)$/.exec(value);
      if (match) {
        const lightId = parseInt(match[1]);
        const light = getItem(lightId, lights, 'lightId');
        light.brightness = parseInt(values[value]);
      }
    }

    props.createScene(values.name, lights);
  }

  const spec: FormSchema[] = [
    {
      type: FormSchemaType.Text,
      name: 'name',
      label: 'Scene name',
      inputPlaceholder: 'e.g. Party Mode',
      unavailableValues: props.unavailableSceneNames
    }
  ];
  for (const light of props.lights) {
    spec.push({
      type: FormSchemaType.Group,
      name: light.id.toString(),
      label: light.name,
      entries: [
        {
          type: FormSchemaType.Select,
          name: 'pattern',
          label: 'Pattern',
          options: [{ value: 'off', label: 'Off' }].concat(
            props.patterns.map((pattern) => ({
              value: pattern.id.toString(),
              label: pattern.name
            }))
          ),
          defaultValue: 'off'
        },
        {
          type: FormSchemaType.Range,
          name: 'brightness',
          label: 'Brightness',
          min: 0,
          max: MAX_BRIGHTNESS,
          step: BRIGHTNESS_STEP,
          defaultValue: MAX_BRIGHTNESS
        }
      ]
    });
  }

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
        title="Create Scene"
        confirmLabel="Create scene"
        schema={spec}
      />
    </div>
  );
};
