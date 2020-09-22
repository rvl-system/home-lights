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

import React, {
  FunctionComponent,
  cloneElement,
  Children,
  ReactElement
} from 'react';
import {
  Button,
  Dialog as MaterialDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
import { Color } from '../../types';

export interface DialogInputBaseProps {
  name: string;
  defaultValue?: string;
  onValueChange?: (name: string, newValue: string) => void;
}

export type DialogValue = Record<string, string>;

export interface DialogProps {
  onConfirm: (newValue: DialogValue) => void;
  onCancel: () => void;
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmColor?: Color;
  cancelLabel?: string;
  cancelColor?: Color;
}

export const Dialog: FunctionComponent<DialogProps> = ({
  children,
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
  const initialValue: DialogValue = {};
  children = Children.map(children, (child) => {
    const name = (child as ReactElement).props.name;
    if (typeof name !== 'string') {
      throw new Error('The name field is required and must be a string');
    }
    const defaultValue: string =
      (child as ReactElement).props.defaultValue || '';
    const newChildProps: DialogInputBaseProps = {
      onValueChange: (name, newValue) => {
        const newState = {
          ...value,
          [name]: newValue
        };
        setValue(newState);
      },
      name,
      defaultValue
    };
    if (!newChildProps.onValueChange) {
      throw new Error(
        `Internal Error: "onValueChange" is unexpectedly undefined`
      );
    }
    if (!initialValue[name]) {
      initialValue[name] = defaultValue;
    }
    return cloneElement(child as any, newChildProps);
  });

  const [value, setValue] = React.useState<DialogValue>(initialValue);

  function handleOnCancel(e: React.MouseEvent) {
    e.stopPropagation();
    onCancel();
  }

  function handleOnConfirm(e: React.MouseEvent) {
    e.stopPropagation();
    onConfirm(value);
  }

  return (
    <React.Fragment>
      <MaterialDialog
        open={open}
        onClose={onCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnCancel} color={cancelColor}>
            {cancelLabel}
          </Button>
          <Button onClick={handleOnConfirm} color={confirmColor}>
            {confirmLabel}
          </Button>
        </DialogActions>
      </MaterialDialog>
    </React.Fragment>
  );
};
