import React, { FunctionComponent } from 'react';
import { TextField } from '@material-ui/core';
import { DialogInputBaseProps } from './dialog';

export interface TextDialogInputProps extends DialogInputBaseProps {
  inputPlaceholder?: string;
}

export const TextDialogInput: FunctionComponent<TextDialogInputProps> = ({
  inputPlaceholder = '',
  name,
  defaultValue,
  onValueChange
}) => {
  if (!onValueChange) {
    throw new Error('Internal Error, `onValueChange` is missing');
  }
  const [value, setValue] = React.useState(defaultValue);
  return (
    <TextField
      autoFocus
      margin="dense"
      type="text"
      placeholder={inputPlaceholder}
      fullWidth
      defaultValue={defaultValue}
      onChange={(e) => {
        setValue(e.currentTarget.value);
        onValueChange(name, e.currentTarget.value);
      }}
    >
      {value}
    </TextField>
  );
};
