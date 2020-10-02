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
import { Button, Fade } from '@material-ui/core';
import { InputDialog } from '../lib/inputDialog';
import { Edit as EditIcon } from '@material-ui/icons';
import { Zone } from '../../common/types';
import { EditMode } from '../../types';

export interface EditZoneButtonProps {
  zone: Zone;
  editMode: EditMode;
  className: string;
}

export interface EditZoneButtonDispatch {
  editZone: (zone: Zone) => void;
}

export const EditZoneButton: FunctionComponent<
  EditZoneButtonProps & EditZoneButtonDispatch
> = (props) => {
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  function handleEditConfirm(name: string) {
    handleEditClose();
    props.editZone({
      ...props.zone,
      name
    });
  }

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
          <EditIcon />
        </Button>
      </Fade>

      <InputDialog
        onConfirm={handleEditConfirm}
        onCancel={handleEditClose}
        open={editDialogOpen}
        title="Edit Zone"
        description='Enter a descriptive name for the zone you wish to change. A zone in
        Home Lights represents a physical area in your home, e.g.
        "kitchen," "guest bedzone", "left side bed nightstand" etc. The zone name
        must not already be in use.'
        inputPlaceholder="e.g. Kitchen"
        defaultValue={props.zone.name}
      />
    </React.Fragment>
  );
};
