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
import { Edit as EditIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { NUM_RVL_CHANNELS } from '../../common/config';
import { Light, RVLLight, LightType, Zone } from '../../common/types';
import { FormInput, SpecType, Spec } from '../lib/formInput';

export interface EditLightButtonProps {
  light: Light;
  className: string;
  canChangeName: boolean;
  zones: Zone[];
}

export interface EditLightButtonDispatch {
  editLight: (light: Light) => void;
}

export const EditLightButton: FunctionComponent<
  EditLightButtonProps & EditLightButtonDispatch
> = (props) => {
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  function handleConfirm(values: Record<string, string>) {
    handleEditClose();
    const newLight: RVLLight = {
      id: props.light.id,
      type: LightType.RVL,
      name: values.name as string,
      channel: parseInt(values.channel),
      zoneId: values.zone !== '-1' ? parseInt(values.zoneId) : undefined
    };
    props.editLight(newLight);
  }

  function handleEditClose() {
    setEditDialogOpen(false);
  }

  const spec: Spec[] = [];
  if (props.canChangeName) {
    spec.push({
      type: SpecType.Text,
      name: 'name',
      description: 'Name',
      inputPlaceholder: 'e.g. Left bedside lamp',
      defaultValue: props.light.name
    });
  }
  spec.push({
    type: SpecType.Select,
    name: 'zoneId',
    description: 'Zone',
    options: [{ value: '-1', label: 'Unassigned' }].concat(
      props.zones.map((zone) => ({
        value: zone.id.toString(),
        label: zone.name
      }))
    ),
    defaultValue:
      typeof props.light.zoneId === 'number'
        ? props.light.zoneId.toString()
        : '-1'
  });
  if (props.light.type === LightType.RVL) {
    spec.push({
      type: SpecType.Select,
      name: 'channel',
      description: 'Channel',
      options: Array.from(Array(NUM_RVL_CHANNELS).keys()).map((key, i) => ({
        value: i.toString(),
        label: i.toString()
      })),
      defaultValue: (props.light as RVLLight).channel.toString()
    });
  }

  return (
    <React.Fragment>
      <Button
        className={props.className}
        onClick={(e) => {
          e.stopPropagation();
          setEditDialogOpen(true);
        }}
      >
        <EditIcon />
      </Button>

      <FormInput
        onConfirm={handleConfirm}
        onCancel={handleEditClose}
        open={editDialogOpen}
        title={`Edit "${props.light.name}"`}
        confirmLabel="Save light"
        spec={spec}
      />
    </React.Fragment>
  );
};
