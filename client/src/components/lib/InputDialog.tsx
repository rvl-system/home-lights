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
import { Color } from '../../types';

export interface ConfirmDialogProps {
  onConfirm: (newValue: string) => void;
  onCancel: () => void;
  open: boolean;
  title: string;
  description: string;
  defaultValue?: string;
  inputPlaceholder?: string;
  confirmLabel?: string;
  confirmColor?: Color;
  cancelLabel?: string;
  cancelColor?: Color;
}

export function InputDialog(props: ConfirmDialogProps): JSX.Element {
  const {
    onConfirm,
    onCancel,
    open,
    title,
    description,
    defaultValue = '',
    inputPlaceholder = '',
    confirmLabel = 'Confirm',
    confirmColor = 'primary',
    cancelLabel = 'Cancel',
    cancelColor = 'default'
  } = props;
  const [value, setValue] = React.useState(defaultValue);
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
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            placeholder={inputPlaceholder}
            fullWidth
            defaultValue={defaultValue}
            onChange={(e) => setValue(e.currentTarget.value)}
          >
            {value}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color={cancelColor}>
            {cancelLabel}
          </Button>
          <Button onClick={() => onConfirm(value)} color={confirmColor}>
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
