import React, { FunctionComponent } from 'react';
import { InputLabel, Select, MenuItem } from '@material-ui/core';
import { DialogInputBaseProps, useDefaultStyles } from './dialogComponent';

export interface SelectDialogInputProps extends DialogInputBaseProps {
  selectValues: Array<{ value: string; label: string }>;
}

export const SelectDialogInput: FunctionComponent<SelectDialogInputProps> = ({
  name,
  description,
  selectValues,
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
      <Select
        value={value}
        onChange={(e) => {
          const newValue = e.target.value as string;
          onValueChange(name, newValue);
          setValue(newValue);
        }}
      >
        {selectValues.map((value) => (
          <MenuItem key={value.value} value={value.value}>
            {value.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
