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

import {
  Button,
  Dialog as MaterialDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { FunctionComponent } from 'react';
import { UIColor } from '../../types';

export const useDefaultStyles = makeStyles({
  container: {
    'margin-top': '2em',
    'margin-bottom': '2em'
  }
});

export interface ConfirmDialogProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmColor?: UIColor;
  cancelLabel?: string;
  cancelColor?: UIColor;
}

export const ConfirmDialog: FunctionComponent<ConfirmDialogProps> = ({
  onConfirm,
  onCancel,
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmColor = 'primary',
  cancelLabel = 'Cancel',
  cancelColor = 'default'
}) => {
  function handleOnCancel(e: React.MouseEvent) {
    e.stopPropagation();
    if (onCancel) {
      onCancel();
    }
  }

  function handleOnConfirm(e: React.MouseEvent) {
    e.stopPropagation();
    if (onConfirm) {
      onConfirm();
    }
  }

  return (
    <React.Fragment>
      <MaterialDialog
        open={open}
        onClose={onCancel}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {description && <DialogContentText>{description}</DialogContentText>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnCancel} color={cancelColor}>
            {cancelLabel}
          </Button>
          <Button
            onClick={handleOnConfirm}
            color={confirmColor}
            variant="contained"
          >
            {confirmLabel}
          </Button>
        </DialogActions>
      </MaterialDialog>
    </React.Fragment>
  );
};
