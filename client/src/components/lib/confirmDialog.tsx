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
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { Color } from '../../types';

export interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmColor?: Color;
  cancelLabel?: string;
  cancelColor?: Color;
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
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <DialogActions>
            <Button onClick={onCancel} color={cancelColor}>
              {cancelLabel}
            </Button>
            <Button onClick={onConfirm} color={confirmColor} autoFocus>
              {confirmLabel}
            </Button>
          </DialogActions>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
