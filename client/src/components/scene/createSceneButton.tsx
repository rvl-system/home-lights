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
import { Light, Pattern, SceneLightEntry } from '../../common/types';
import { FormInput, Spec, SpecType } from '../lib/formInput';

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
        const light = lights.find((light) => light.lightId === lightId);
        if (!light) {
          throw new Error(
            `Internal Error: could not find brightness entry for light ${lightId}`
          );
        }
        light.brightness = parseInt(values[value]);
      }
    }

    props.createScene(values.name, lights);
  }

  const spec: Spec[] = [
    {
      type: SpecType.Text,
      name: 'name',
      description: 'Scene name',
      inputPlaceholder: 'e.g. Chill'
    }
  ];
  for (const light of props.lights) {
    spec.push({
      type: SpecType.Label,
      label: light.name
    });
    spec.push({
      type: SpecType.Select,
      name: `pattern-${light.id}`,
      description: 'Pattern',
      options: [{ value: 'off', label: 'Off' }].concat(
        props.patterns.map((pattern) => ({
          value: pattern.id.toString(),
          label: pattern.name
        }))
      ),
      defaultValue: 'off'
    });
    spec.push({
      type: SpecType.Range,
      name: `brightness-${light.id}`,
      description: 'Brightness',
      min: 0,
      max: 255,
      defaultValue: 255
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
        spec={spec}
      />
    </div>
  );
};
