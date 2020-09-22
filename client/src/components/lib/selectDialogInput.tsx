import React, { FunctionComponent, Fragment } from 'react';
import { InputLabel, Select, MenuItem } from '@material-ui/core';
import { DialogInputBaseProps } from './dialog';

export interface SelectDialogInputProps extends DialogInputBaseProps {
  selectValues: Array<{ value: string; label: string }>;
  description?: string;
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
  const [value, setValue] = React.useState(defaultValue);
  return (
    <Fragment>
      {description && (
        <InputLabel id="demo-simple-select-helper-label">
          {description}
        </InputLabel>
      )}
      <Select
        labelId="demo-simple-select-helper-label"
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
    </Fragment>
  );
};
