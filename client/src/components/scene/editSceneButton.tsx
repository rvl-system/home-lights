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

import { Button, Fade } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { Light, Pattern, Scene, SceneLightEntry } from '../../common/types';
import { FormInput, Spec, SpecType } from '../lib/formInput';
import { useContentStyles } from '../lib/pageStyles';

export interface EditSceneButtonProps {
  scene: Scene;
  patterns: Pattern[];
  lights: Light[];
}

export interface EditSceneButtonDispatch {
  editScene: (scene: Scene) => void;
}

export const EditSceneButton: FunctionComponent<
  EditSceneButtonProps & EditSceneButtonDispatch
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

    props.editScene({
      ...props.scene,
      name: values.name,
      lights
    });
  }

  const spec: Spec[] = [
    {
      type: SpecType.Text,
      name: 'name',
      description: 'Scene name',
      inputPlaceholder: 'e.g. Chill',
      defaultValue: props.scene.name
    }
  ];
  for (const lightEntry of props.scene.lights) {
    const light = props.lights.find((light) => light.id === lightEntry.lightId);
    if (!light) {
      throw new Error(
        `Internal Error: could not find light with ID ${lightEntry.lightId}`
      );
    }
    let pattern;
    if (lightEntry.patternId) {
      pattern = props.patterns.find(
        (pattern) => pattern.id === lightEntry.patternId
      );
      if (!pattern) {
        throw new Error(
          `Internal Error: could not find pattern with ID ${lightEntry.patternId}`
        );
      }
    }
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
      defaultValue: pattern ? pattern.id.toString() : 'off'
    });
    spec.push({
      type: SpecType.Range,
      name: `brightness-${light.id}`,
      description: 'Brightness',
      min: 0,
      max: 255,
      defaultValue: lightEntry.brightness
    });
  }

  const classes = useContentStyles();
  return (
    <React.Fragment>
      <Fade in={true} mountOnEnter unmountOnExit>
        <Button
          className={classes.rightAccordionButton}
          onClick={(e) => {
            e.stopPropagation();
            setOpenDialog(true);
          }}
        >
          <EditIcon />
        </Button>
      </Fade>

      <FormInput
        onConfirm={handleConfirm}
        onCancel={handleClose}
        open={openDialog}
        title={`Edit "${props.scene.name}"`}
        confirmLabel="Save scene"
        spec={spec}
      />
    </React.Fragment>
  );
};
