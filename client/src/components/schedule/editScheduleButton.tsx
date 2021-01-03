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

import { Button, Fade, List } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import React, { FunctionComponent, useState } from 'react';
import { Scene, Schedule, ScheduleEntry, Zone } from '../../common/types';
import { Modal } from '../lib/modal';
import { useContentStyles } from '../lib/pageStyles';
import { CreateScheduleEntryButton } from './createScheduleEntryButton';
import { ScheduleEntryComponent } from './scheduleEntryComponent.tsx';

export interface EditScheduleButtonProps {
  schedule: Schedule;
  scenes: Scene[];
  zone: Zone;
}

export interface EditScheduleButtonDispatch {
  editSchedule: (schedule: Schedule) => void;
}

export const EditSceneButton: FunctionComponent<
  EditScheduleButtonProps & EditScheduleButtonDispatch
> = (props) => {
  function entriesSorter(a: ScheduleEntry, b: ScheduleEntry) {
    return a.hour * 60 + a.minute - (b.hour * 60 + b.minute);
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [entries, setEntries] = useState(
    props.schedule.entries.sort(entriesSorter)
  );
  const contentClasses = useContentStyles();

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm() {
    handleClose();
  }

  function handleCreateEntry(scheduleEntry: ScheduleEntry) {
    setEntries([...entries, scheduleEntry].sort(entriesSorter));
  }

  function handleEditEntry(scheduleEntry: ScheduleEntry) {
    console.log('Edit entry');
    console.log(scheduleEntry);
  }

  function handleDeleteEntry() {
    console.log('Delete entry');
  }

  return (
    <>
      <Fade in={true} mountOnEnter unmountOnExit>
        <Button
          className={contentClasses.rightAccordionButton}
          onClick={(e) => {
            e.stopPropagation();
            setOpenDialog(true);
          }}
        >
          <EditIcon />
        </Button>
      </Fade>

      <Modal
        canConfirm={true}
        onConfirm={handleConfirm}
        onCancel={handleClose}
        open={openDialog}
        title={`Create "${props.zone.name}" schedule entry`}
        confirmLabel="Save schedule"
      >
        <CreateScheduleEntryButton
          scenes={props.scenes}
          onConfirm={handleCreateEntry}
        />
        <List>
          {entries.map((entry) => (
            <ScheduleEntryComponent
              key={entry.hour * 60 + entry.minute}
              scenes={props.scenes}
              scheduleEntry={entry}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          ))}
        </List>
      </Modal>
    </>
  );
};
