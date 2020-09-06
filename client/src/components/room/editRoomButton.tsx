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

import * as React from 'react';
import { Button, Fade } from '@material-ui/core';
import { InputDialog } from '../lib/InputDialog';
import { Edit } from '@material-ui/icons';
import { Room } from '../../common/types';
import { EditMode } from '../../types';

export interface EditRoomButtonProps {
  room: Room;
  editMode: EditMode;
  className: string;
}

export interface EditRoomButtonDispatch {
  editRoom: (room: Room) => void;
}

export function EditRoomButton(
  props: EditRoomButtonProps & EditRoomButtonDispatch
): JSX.Element {
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  function handleEditClose() {
    setEditDialogOpen(false);
  }

  return (
    <React.Fragment>
      <Fade in={props.editMode === EditMode.edit} mountOnEnter unmountOnExit>
        <Button
          className={props.className}
          onClick={(e) => {
            e.stopPropagation();
            setEditDialogOpen(true);
          }}
        >
          <Edit />
        </Button>
      </Fade>

      <InputDialog
        onConfirm={(name) => {
          handleEditClose();
          props.editRoom({
            ...props.room,
            name
          });
        }}
        onCancel={handleEditClose}
        open={editDialogOpen}
        title="Edit Room"
        description='Enter a descriptive name for the room you wish to add. A room in
          Home Lights represents a physical room in your home, e.g.
          "kitchen," "guest bedroom", etc. The room name
          must not already be in use.'
        inputPlaceholder="e.g. Kitchen"
        defaultValue={props.room.name}
      />
    </React.Fragment>
  );
}
