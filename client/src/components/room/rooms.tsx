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
import { reduce } from 'conditional-reduce';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Edit, Close } from '@material-ui/icons';
import { Room } from '../../common/types';
import { CreateRoom } from './createRoom';
import { RoomList, EditMode } from './roomList';

const useStyles = makeStyles({
  container: {
    height: '100%',
    'max-height': '100%',
    display: 'grid',
    'grid-template-rows':
      '[header-start] auto [content-start] minmax(0, 1fr) [end]',
    'grid-template-columns':
      '[left-start] auto [center-start] 1fr [right-start] auto [end]'
  },
  header: {
    'grid-column-start': 'right-start',
    'grid-column-end': 'end',
    'grid-row-start': 'header-start',
    'grid-row-end': 'header-start',
    padding: '1em'
  },
  altHeader: {
    'grid-column-start': 'left-start',
    'grid-column-end': 'center-start',
    'grid-row-start': 'header-start',
    'grid-row-end': 'header-start',
    padding: '1em'
  },
  content: {
    'grid-column-start': 'left-start',
    'grid-column-end': 'end',
    'grid-row-start': 'content-start',
    'grid-row-end': 'end',
    position: 'relative',
    'overflow-y': 'scroll'
  },
  innerContent: {
    position: 'absolute',
    width: '100%'
  }
});

export interface RoomsProps {
  rooms: Room[];
}

export interface RoomsDispatch {
  createRoom: (name: string) => void;
  deleteRoom: (id: number) => void;
}

export function Rooms(props: RoomsProps & RoomsDispatch): JSX.Element {
  const [editMode, setEditMode] = React.useState(EditMode.view);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        {reduce(editMode, {
          [EditMode.view]: () => (
            <Button
              variant="outlined"
              onClick={() => setEditMode(EditMode.edit)}
            >
              <Edit />
            </Button>
          ),
          [EditMode.edit]: () => (
            <Button
              variant="outlined"
              onClick={() => setEditMode(EditMode.view)}
            >
              <Close />
            </Button>
          )
        })}
      </div>

      <div className={classes.content}>
        <div className={classes.innerContent}>
          <RoomList
            rooms={props.rooms}
            editMode={editMode}
            deleteRoom={props.deleteRoom}
          />
        </div>
      </div>
      {editMode === EditMode.edit && (
        <div className={classes.altHeader}>
          <CreateRoom createRoom={props.createRoom} />
        </div>
      )}
    </div>
  );
}
