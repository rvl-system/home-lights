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
import React, { FunctionComponent, useState } from 'react';
import {
  Light,
  LightType,
  Pattern,
  PatternType,
  Scene,
  SceneLightEntry
} from '../../common/types';
import { getItem } from '../../common/util';
import { FormInput, FormSchema, FormSchemaType } from '../lib/formInput';
import { useContentStyles } from '../lib/pageStyles';

export interface EditSceneButtonProps {
  scene: Scene;
  patterns: Pattern[];
  lights: Light[];
  unavailableSceneNames: string[];
}

export interface EditSceneButtonDispatch {
  editScene: (scene: Scene) => void;
}

export const EditSceneButton: FunctionComponent<
  EditSceneButtonProps & EditSceneButtonDispatch
> = (props) => {
  const [openDialog, setOpenDialog] = useState(false);

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm(
    values: Record<string, string | Record<string, string>>
  ) {
    handleClose();
    const lights: SceneLightEntry[] = [];
    for (const value in values) {
      if (value === 'name') {
        continue;
      }
      const lightId = parseInt(value);
      const lightEntry: Record<string, string> = values[value] as Record<
        string,
        string
      >;
      lights.push({
        lightId,
        patternId:
          lightEntry.pattern === 'off'
            ? undefined
            : parseInt(lightEntry.pattern),
        brightness: parseInt(lightEntry.brightness)
      });
    }

    props.editScene({
      ...props.scene,
      name: values.name as string,
      lights
    });
  }

  const spec: FormSchema[] = [
    {
      type: FormSchemaType.Text,
      name: 'name',
      label: 'Scene name',
      inputPlaceholder: 'e.g. Chill',
      defaultValue: props.scene.name,
      unavailableValues: props.unavailableSceneNames
    }
  ];
  for (const lightEntry of props.scene.lights) {
    const light = getItem(lightEntry.lightId, props.lights);
    let pattern: Pattern | undefined;
    if (lightEntry.patternId !== undefined) {
      pattern = getItem(lightEntry.patternId, props.patterns);
    }
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
            props.patterns
              .filter((pattern) =>
                light.type === LightType.RVL
                  ? true
                  : pattern.type === PatternType.Solid
              )
              .map((pattern) => ({
                value: pattern.id.toString(),
                label: pattern.name
              }))
          ),
          defaultValue: pattern ? pattern.id.toString() : 'off'
        },
        {
          type: FormSchemaType.Range,
          name: 'brightness',
          label: 'Brightness',
          min: 0,
          max: 255,
          defaultValue: lightEntry.brightness
        }
      ]
    });
  }

  const classes = useContentStyles();
  return (
    <>
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
        schema={spec}
      />
    </>
  );
};
