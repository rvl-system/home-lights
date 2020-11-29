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
import { Delete as DeleteIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { Light } from '../../common/types';
import { DialogComponent } from '../lib/dialogComponent';

export interface DeleteLightButtonProps {
  light: Light;
  className: string;
}

export interface DeleteLightButtonDispatch {
  deleteLight: (id: number) => void;
}

export const DeleteLightButton: FunctionComponent<
  DeleteLightButtonDispatch & DeleteLightButtonProps
> = (props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  function handleDeleteClose() {
    setDeleteDialogOpen(false);
  }

  return (
    <React.Fragment>
      <Button
        className={props.className}
        color="secondary"
        onClick={(e) => {
          e.stopPropagation();
          setDeleteDialogOpen(true);
        }}
      >
        <DeleteIcon />
      </Button>

      <DialogComponent
        onConfirm={() => {
          handleDeleteClose();
          props.deleteLight(props.light.id);
        }}
        onCancel={handleDeleteClose}
        open={deleteDialogOpen}
        title={`Delete "${props.light.name}"?`}
        description="This operation cannot be undone"
        confirmLabel="Delete light"
        confirmColor="secondary"
      />
    </React.Fragment>
  );
};
