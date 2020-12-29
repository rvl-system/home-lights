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

import { Button } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { ColorType, Pattern } from '../../common/types';
import { PatternInput } from './patternInput';

export interface EditPatternButtonProps {
  pattern: Pattern;
  className: string;
  unavailablePatternNames: string[];
}

export interface EditPatternButtonDispatch {
  editPattern: (pattern: Pattern) => void;
}

export const EditPatternButton: FunctionComponent<
  EditPatternButtonProps & EditPatternButtonDispatch
> = (props) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  function handleClose() {
    setOpenDialog(false);
  }
  return (
    <React.Fragment>
      <Button className={props.className} onClick={() => setOpenDialog(true)}>
        <EditIcon />
      </Button>

      <PatternInput
        name={props.pattern.name}
        type={props.pattern.type}
        data={{ color: { type: ColorType.HSV, hue: 0, saturation: 1 } }}
        title={`Edit "${props.pattern.name}"`}
        confirmLabel="Save pattern"
        unavailablePatternNames={props.unavailablePatternNames}
        open={openDialog}
        onClose={handleClose}
        onConfirm={(scene) => console.log(scene)}
      />
    </React.Fragment>
  );
};
