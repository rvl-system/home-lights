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
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography
} from '@material-ui/core';
import { ExpandMore, Delete } from '@material-ui/icons';
import { Room } from '../../common/types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  detailContainer: {
    display: 'flex',
    'flex-direction': 'column'
  }
}));

export enum EditMode {
  view = 'view',
  edit = 'edit'
}

export interface RoomListProps {
  rooms: Room[];
  editMode: EditMode;
}

export interface RoomListDispatch {
  deleteRoom: (id: number) => void;
}

export function RoomList(props: RoomListProps & RoomListDispatch): JSX.Element {
  const [roomToDelete, setRoomToDelete] = React.useState<Room | null>(null);
  const classes = useStyles();

  function handleClose() {
    setRoomToDelete(null);
  }

  return (
    <React.Fragment>
      {props.rooms.map((room) => (
        <Accordion key={room.id}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>{room.name}</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.detailContainer}>
            {props.editMode === EditMode.edit && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setRoomToDelete(room)}
              >
                <Delete />
              </Button>
            )}
            <Typography>TODO: scenes for {room.name}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog
        open={!!roomToDelete}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete room{' '}
            {roomToDelete && roomToDelete.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                handleClose();
                if (roomToDelete) {
                  props.deleteRoom(roomToDelete.id);
                }
              }}
              color="secondary"
              autoFocus
            >
              Delete Room
            </Button>
          </DialogActions>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
