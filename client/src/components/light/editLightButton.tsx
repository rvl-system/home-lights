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
import { InputDialog } from '../lib/inputDialog';
import { Edit } from '@material-ui/icons';
import { Light } from '../../common/types';

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
        <Edit />
      </Button>

      <InputDialog
        onConfirm={(name) => {
          handleEditClose();
          props.editLight({
            ...props.light,
            name
          });
        }}
        onCancel={handleEditClose}
        open={editDialogOpen}
        title="Edit Light"
        description='Enter a descriptive name for the light you wish to change. A light in
        Home Lights represents a physical area in your home, e.g.
        "kitchen," "guest bedlight", "left side bed nightstand" etc. The light name
        must not already be in use.'
        inputPlaceholder="e.g. Kitchen"
        defaultValue={props.light.name}
      />
    </React.Fragment>
  );
};
