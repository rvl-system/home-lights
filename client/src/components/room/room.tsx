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
  Switch,
  Typography,
  Fade
} from '@material-ui/core';
import { ConfirmDialog } from '../lib/ConfirmDialog';
import { InputDialog } from '../lib/InputDialog';
import { ExpandMore, Delete, Edit } from '@material-ui/icons';
import { Room } from '../../common/types';
import { EditMode } from '../../types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  detailContainer: {
    display: 'flex',
    'flex-direction': 'column'
  },
  roomHeading: {
    display: 'grid',
    'grid-template-columns':
      '[left-icon-start] auto [title-start] 1fr [right-icon-start] auto [end]',
    'grid-template-rows': 'auto',
    width: '100%',
    height: '38px',
    'align-items': 'center'
  },
  leftButton: {
    'min-width': '4em',
    width: '4em',
    'grid-column-start': 'left-icon-start',
    'grid-column-end': 'title-start',
    'grid-row-start': 1,
    'grid-row-end': 1
  },
  roomTitle: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    'padding-left': '1em',
    'grid-column-start': 'title-start',
    'grid-column-end': 'right-icon-start',
    'grid-row-start': 1,
    'grid-row-end': 1
  },
  rightButton: {
    'min-width': '2em',
    width: '2em',
    'grid-column-start': 'right-icon-start',
    'grid-column-end': 'end',
    'grid-row-start': 1,
    'grid-row-end': 1
  }
}));

export interface RoomProps {
  room: Room;
  editMode: EditMode;
}

export interface RoomDispatch {
  editRoom: (room: Room) => void;
  deleteRoom: (id: number) => void;
}

export function Room(props: RoomProps & RoomDispatch): JSX.Element {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const classes = useStyles();

  function handleDeleteClose() {
    setDeleteDialogOpen(false);
  }

  function handleEditClose() {
    setEditDialogOpen(false);
  }

  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={classes.roomHeading}>
            <Fade
              in={props.editMode === EditMode.edit}
              mountOnEnter
              unmountOnExit
            >
              <Button
                className={classes.leftButton}
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialogOpen(true);
                }}
              >
                <Delete />
              </Button>
            </Fade>
            {props.editMode === EditMode.view && (
              <Switch
                className={classes.leftButton}
                color="default"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={() => {
                  // TODO
                }}
              />
            )}
            <Typography className={classes.roomTitle}>
              {props.room.name}
            </Typography>
            <Fade
              in={props.editMode === EditMode.edit}
              mountOnEnter
              unmountOnExit
            >
              <Button
                className={classes.rightButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditDialogOpen(true);
                }}
              >
                <Edit />
              </Button>
            </Fade>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.detailContainer}>
          <Typography>TODO: scenes for {props.room.name}</Typography>
        </AccordionDetails>
      </Accordion>

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
      />

      <ConfirmDialog
        onConfirm={() => {
          handleDeleteClose();
          props.deleteRoom(props.room.id);
        }}
        onCancel={handleDeleteClose}
        open={deleteDialogOpen}
        title="Delete Room"
        description={`Are you sure you want to delete room ${props.room.name}?`}
        confirmLabel="Delete Room"
      />
    </React.Fragment>
  );
}
