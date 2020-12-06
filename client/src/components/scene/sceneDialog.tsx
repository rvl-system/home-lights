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
import { Add as AddIcon, Edit as EditIcon } from '@material-ui/icons';
import React, { Fragment, FunctionComponent } from 'react';
import { CreateSceneRequest, Scene, Light, Pattern } from '../../common/types';
import { FormInput, Spec, SpecType } from '../lib/formInput';

export interface SceneDialogProps {
  scene?: Scene;
  zoneId: number;
  patterns: Pattern[];
  lights: Light[];
  className: string;
}

export interface SceneDialogDispatch {
  onConfirm: (updatedScene: CreateSceneRequest | Scene) => void;
}

export const SceneDialog: FunctionComponent<
  SceneDialogProps & SceneDialogDispatch
> = (props) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const isEdit = !!props.scene;
  const scene: CreateSceneRequest | Scene = props.scene || {
    name: '',
    zoneId: props.zoneId,
    lights: props.lights.map((light) => ({
      lightId: light.id,
      brightness: 1
    }))
  };

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm(values: Record<string, string>) {
    handleClose();
    props.onConfirm({
      ...scene,
      ...values
    });
  }

  const spec: Spec[] = [
    {
      type: SpecType.Text,
      name: 'name',
      description: 'Name',
      inputPlaceholder: 'e.g. Chill',
      defaultValue: scene.name
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
      options: [{ value: '-1', label: 'Off' }].concat(
        props.patterns.map((pattern) => ({
          value: pattern.id.toString(),
          label: pattern.name
        }))
      ),
      defaultValue: '-1'
    });
  }

  return (
    <Fragment>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpenDialog(true)}
        className={props.className}
      >
        {isEdit ? <EditIcon /> : <AddIcon />}
      </Button>

      <FormInput
        onConfirm={handleConfirm}
        onCancel={handleClose}
        open={openDialog}
        title={isEdit ? `Edit ${scene.name}` : 'Create Scene'}
        confirmLabel={isEdit ? 'Save scene' : 'Create scene'}
        spec={spec}
      />
    </Fragment>
  );
};
