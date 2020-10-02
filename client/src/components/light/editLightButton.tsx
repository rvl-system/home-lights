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

import React, { FunctionComponent } from 'react';
import { Button } from '@material-ui/core';
import { reduce } from 'conditional-reduce';
import { Dialog, DialogValue } from '../lib/dialog';
import { SelectDialogInput } from '../lib/selectDialogInput';
import { TextDialogInput } from '../lib/textDialogInput';
import { Edit as EditIcon } from '@material-ui/icons';
import { Light, RVLLight, LightType } from '../../common/types';
import { NUM_RVL_CHANNELS } from '../../common/config';

export interface EditLightButtonProps {
  light: Light;
  className: string;
}

export interface EditLightButtonDispatch {
  editLight: (light: Light) => void;
}

export const EditLightButton: FunctionComponent<
  EditLightButtonProps & EditLightButtonDispatch
> = (props) => {
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  function handleConfirm(values: DialogValue) {
    handleEditClose();
    props.editLight({
      ...props.light,
      ...values
    });
  }

  function handleEditClose() {
    setEditDialogOpen(false);
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

      <Dialog
        onConfirm={handleConfirm}
        onCancel={handleEditClose}
        open={editDialogOpen}
        title="Create Zone"
        description='Edit a light. A light in Home Lights represents a
        physical light in your home, e.g. "Left bedside lamp," "Kitchen
        accent," etc.'
      >
        <TextDialogInput
          name="name"
          description="Friendly name of the light"
          inputPlaceholder="name"
          defaultValue={props.light.name}
        />
        {reduce(props.light.type, {
          [LightType.RVL]: () => (
            <SelectDialogInput
              name="channel"
              description="The RVL light channel"
              selectValues={Array.from(Array(NUM_RVL_CHANNELS).keys()).map(
                (_, i) => ({
                  value: i.toString(),
                  label: i.toString()
                })
              )}
              defaultValue={(props.light as RVLLight).channel.toString()}
            />
          ),
          [LightType.PhilipsHue]: () => <div></div> // We'll likely add stuff later
        })}
      </Dialog>
    </React.Fragment>
  );
};
