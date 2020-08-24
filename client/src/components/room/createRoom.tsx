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
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export interface CreateRoomDispatch {
  createRoom: (name: string) => void;
}

const useStyles = makeStyles({
  container: {
    padding: '1em',
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center'
  }
});

export function CreateRoom(props: CreateRoomDispatch): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');

  function handleClose() {
    setOpen(false);
  }

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Room
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a descriptive name for the room. The room name must not
            already be in use.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room Name"
            type="text"
            fullWidth
            onChange={(e) => setName(e.currentTarget.value)}
          >
            {name}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              props.createRoom(name);
            }}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
