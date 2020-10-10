import React, { FunctionComponent } from 'react';
import { TextField, InputLabel } from '@material-ui/core';
import { DialogInputBaseProps, useDefaultStyles } from './dialog';

export interface TextDialogInputProps extends DialogInputBaseProps {
  inputPlaceholder?: string;
}

export const TextDialogInput: FunctionComponent<TextDialogInputProps> = ({
  inputPlaceholder = '',
  name,
  description,
  defaultValue,
  onValueChange
}) => {
  if (!onValueChange) {
    throw new Error('Internal Error, `onValueChange` is missing');
  }
  const classes = useDefaultStyles();
  const [value, setValue] = React.useState(defaultValue);
  return (
    <div className={classes.container}>
      {description && <InputLabel>{description}</InputLabel>}
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
    </div>
  );
};
