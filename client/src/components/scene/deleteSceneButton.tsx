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
import { Delete as DeleteIcon } from '@material-ui/icons';
import React, { FunctionComponent, useState } from 'react';
import { EditMode, Scene } from '../../common/types';
import { ConfirmDialog } from '../lib/confirmDialog';

export interface DeleteSceneButtonProps {
  scene: Scene;
  editMode: EditMode;
  className: string;
}

export interface DeleteSceneButtonDispatch {
  deleteScene: (id: number) => void;
}

export const DeleteSceneButton: FunctionComponent<
  DeleteSceneButtonDispatch & DeleteSceneButtonProps
> = (props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handleDeleteClose() {
    setDeleteDialogOpen(false);
  }

  return (
    <>
      <Fade in={props.editMode === EditMode.Edit} mountOnEnter unmountOnExit>
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
      </Fade>

      <ConfirmDialog
        onConfirm={() => {
          handleDeleteClose();
          props.deleteScene(props.scene.id);
        }}
        onCancel={handleDeleteClose}
        open={deleteDialogOpen}
        title={`Delete "${props.scene.name}"?`}
        description="This operation cannot be undone"
        confirmLabel="Delete scene"
        confirmColor="secondary"
      />
    </>
  );
};
