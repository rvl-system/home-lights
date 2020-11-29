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
import React, {
  FunctionComponent,
  cloneElement,
  Children,
  ReactElement
} from 'react';
import { Color } from '../../types';

export const useDefaultStyles = makeStyles({
  container: {
    'margin-top': '2em',
    'margin-bottom': '2em'
  }
});

export interface DialogInputBaseProps {
  name: string;
  description?: string;
  defaultValue?: string | number;
  onValueChange?: (name: string, newValue: string | number) => void;
}

export type DialogValue = Record<string, string | number>;

export interface DialogComponentProps {
  onConfirm?: (newValue: DialogValue) => void;
  onCancel?: () => void;
  onChange?: (newValue: DialogValue) => void;
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmColor?: Color;
  cancelLabel?: string;
  cancelColor?: Color;
}

export const DialogComponent: FunctionComponent<DialogComponentProps> = ({
  children,
  onConfirm,
  onCancel,
  onChange,
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmColor = 'primary',
  cancelLabel = 'Cancel',
  cancelColor = 'default'
}) => {
  children = Children.map(children, (child) => {
    const { name, defaultValue } = getDefaultValue(child as ReactElement);
    if (!name) {
      return;
    }
    const newChildProps: DialogInputBaseProps = {
      onValueChange: (name, newValue) => {
        const newState = {
          ...value,
          [name]: newValue
        };
        setValue(newState);
        if (onChange) {
          onChange(newState);
        }
      },
      name,
      defaultValue
    };
    if (!newChildProps.onValueChange) {
      throw new Error(
        'Internal Error: "onValueChange" is unexpectedly undefined'
      );
    }
    return cloneElement(child as any, newChildProps);
  });

  function getDefaultValue(
    child: ReactElement
  ): { name: string; defaultValue: string | number } {
    if (!child || !child.props) {
      return { name: '', defaultValue: '' };
    }
    const name = child.props.name;
    if (typeof name !== 'string') {
      return { name: '', defaultValue: '' };
    }
    const defaultValue: string =
      child.props.defaultValue === undefined ? '' : child.props.defaultValue;
    return { name, defaultValue };
  }

  const [value, setValue] = React.useState<DialogValue>(getDefaultValues());

  function getDefaultValues(): DialogValue {
    const initialValue: DialogValue = {};
    Children.map(children, (child) => {
      const { name, defaultValue } = getDefaultValue(child as ReactElement);
      if (!name) {
        return;
      }
      initialValue[name] = defaultValue;
    });
    return initialValue;
  }

  function finalize() {
    setValue(getDefaultValues());
  }

  function handleOnCancel(e: React.MouseEvent) {
    e.stopPropagation();
    if (onCancel) {
      onCancel();
    }
    finalize();
  }

  function handleOnConfirm(e: React.MouseEvent) {
    e.stopPropagation();
    if (onConfirm) {
      onConfirm(value);
    }
    finalize();
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
          {children}
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
