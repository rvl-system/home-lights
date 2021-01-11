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
import React, { FunctionComponent, useState } from 'react';
import { Pattern } from '../../common/types';
import { ConfirmDialog } from '../lib/confirmDialog';

export interface DeletePatternButtonProps {
  pattern: Pattern;
  className: string;
}

export interface DeletePatternButtonDispatch {
  deletePattern: (id: number) => void;
}

export const DeletePatternButton: FunctionComponent<
  DeletePatternButtonDispatch & DeletePatternButtonProps
> = (props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handleDeleteClose() {
    setDeleteDialogOpen(false);
  }

  return (
    <>
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

      <ConfirmDialog
        onConfirm={() => {
          handleDeleteClose();
          props.deletePattern(props.pattern.id);
        }}
        onCancel={handleDeleteClose}
        open={deleteDialogOpen}
        title={`Delete "${props.pattern.name}"?`}
        description="This operation cannot be undone"
        confirmLabel="Delete pattern"
        confirmColor="secondary"
      />
    </>
  );
};
