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
import { Edit as EditIcon } from '@material-ui/icons';
import React, { FunctionComponent, useState } from 'react';
import { Scene, Schedule, Zone } from '../../common/types';
import { Modal } from '../lib/modal';
import { useContentStyles } from '../lib/pageStyles';
import { CreateScheduleEntryButton } from './createScheduleEntryButton';

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
  const [openDialog, setOpenDialog] = useState(false);
  const contentClasses = useContentStyles();

  function handleClose() {
    setOpenDialog(false);
  }

  function handleConfirm() {
    handleClose();
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
          onConfirm={(entry) => console.log(entry)}
        />
      </Modal>
    </>
  );
};
