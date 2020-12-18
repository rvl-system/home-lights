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
import {
  Light,
  RVLLight,
  LightType,
  Zone,
  PhilipsHueLight,
  LIFXLight
} from '../../common/types';
import { FormInput, FormSchemaType, FormSchema } from '../lib/formInput';

const OFF = 'off';

export interface EditLightButtonProps {
  light: Light;
  className: string;
  canChangeName: boolean;
  zones: Zone[];
  otherLightNames: string[];
  otherRVLChannels: number[];
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
    switch (props.light.type) {
      case LightType.RVL: {
        const newLight: RVLLight = {
          ...(props.light as RVLLight),
          name: values.name as string,
          channel: parseInt(values.channel),
          zoneId: values.zone !== OFF ? parseInt(values.zoneId) : undefined
        };
        props.editLight(newLight);
        break;
      }
      case LightType.PhilipsHue: {
        const newLight: PhilipsHueLight = {
          ...(props.light as PhilipsHueLight),
          zoneId: values.zone !== OFF ? parseInt(values.zoneId) : undefined
        };
        props.editLight(newLight);
        break;
      }
      case LightType.LIFX: {
        const newLight: LIFXLight = {
          ...(props.light as LIFXLight),
          zoneId: values.zone !== OFF ? parseInt(values.zoneId) : undefined
        };
        props.editLight(newLight);
        break;
      }
    }
  }

  function handleEditClose() {
    setEditDialogOpen(false);
  }

  const spec: FormSchema[] = [];
  if (props.canChangeName) {
    spec.push({
      type: FormSchemaType.Text,
      name: 'name',
      description: 'Name',
      inputPlaceholder: 'e.g. Left bedside lamp',
      defaultValue: props.light.name,
      takenValues: props.otherLightNames
    });
  }
  spec.push({
    type: FormSchemaType.Select,
    name: 'zoneId',
    description: 'Zone',
    options: [{ value: OFF, label: 'Unassigned' }].concat(
      props.zones.map((zone) => ({
        value: zone.id.toString(),
        label: zone.name
      }))
    ),
    defaultValue:
      typeof props.light.zoneId === 'number'
        ? props.light.zoneId.toString()
        : OFF
  });
  if (props.light.type === LightType.RVL) {
    spec.push({
      type: FormSchemaType.Select,
      name: 'channel',
      description: 'Channel',
      options: Array.from(Array(NUM_RVL_CHANNELS).keys()).map((key, i) => ({
        value: i.toString(),
        label: i.toString(),
        disabled: props.otherRVLChannels.includes(i)
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
        schema={spec}
      />
    </React.Fragment>
  );
};
