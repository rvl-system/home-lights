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
import { Color } from '../../types';
import { Dialog } from './dialog';
import { TextDialogInput } from './textDialogInput';

export interface InputDialogProps {
  onConfirm: (newValue: string) => void;
  onCancel: () => void;
  open: boolean;
  title: string;
  description?: string;
  defaultValue?: string;
  inputPlaceholder?: string;
  confirmLabel?: string;
  confirmColor?: Color;
  cancelLabel?: string;
  cancelColor?: Color;
}

export const InputDialog: FunctionComponent<InputDialogProps> = ({
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
}) => {
  return (
    <React.Fragment>
      <Dialog
        onConfirm={(newValue) => onConfirm(newValue.text)}
        onCancel={onCancel}
        open={open}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        confirmColor={confirmColor}
        cancelLabel={cancelLabel}
        cancelColor={cancelColor}
      >
        <TextDialogInput
          name="text"
          defaultValue={defaultValue}
          inputPlaceholder={inputPlaceholder}
        />
      </Dialog>
    </React.Fragment>
  );
};
