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

import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { FunctionComponent } from 'react';
import { Notification } from '../types';

export interface NotificationComponentProps {
  notification: Notification | null;
}

export interface NotificationComponentDispatch {
  dismiss: () => void;
}

export const NotificationComponent: FunctionComponent<
  NotificationComponentProps & NotificationComponentDispatch
> = ({ notification, dismiss }) => {
  if (!notification) {
    return null;
  }

  return (
    <Snackbar
      open={true}
      autoHideDuration={10000}
      onClose={dismiss}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={dismiss}
        severity={notification.severity}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};
