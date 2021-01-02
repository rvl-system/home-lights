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

import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { UIColor } from '../../types';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.background.default,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',

    // I wonder why the TypeScript definitions don't recognize "standalone"?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paddingBottom: (window.navigator as any).standalone ? '20px' : 'inherit'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '20px',
    paddingBottom: '20px'
  },
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  content: {
    flexGrow: 1,
    padding: '20px',
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '20px',
    paddingBottom: '20px',
    minHeight: '75px'
  }
}));

export interface ModalInputProps {
  open: boolean;
  title: string;
  canConfirm: boolean;
  confirmLabel?: string;
  confirmColor?: UIColor;
}

export interface ModalInputDispatch {
  onConfirm: () => void;
  onCancel?: () => void;
}

// Normally we'd use a function expression like we do elsewhere, but we can't
// pass the type generic around if we did, so we have to use a function
// declaration instead
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Modal: FunctionComponent<ModalInputProps & ModalInputDispatch> = (
  props
) => {
  if (!props.open) {
    return null;
  }

  const classes = useStyles();

  return (
    <div className={classes.container} onClick={(e) => e.stopPropagation()}>
      <div className={classes.header}>
        <div>
          <Button
            color="default"
            onClick={() => {
              if (props.onCancel) {
                props.onCancel();
              }
            }}
          >
            <ArrowBackIcon />
          </Button>
        </div>
        <div className={classes.title}>
          {props.title && <Typography>{props.title}</Typography>}
        </div>
      </div>
      <div className={classes.content}>{props.children}</div>
      <div className={classes.footer}>
        <Button
          variant="contained"
          color={props.confirmColor || 'primary'}
          disabled={!props.canConfirm}
          onClick={props.onConfirm}
        >
          {props.confirmLabel || 'Confirm'}
        </Button>
      </div>
    </div>
  );
};
