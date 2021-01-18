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

import { ActionType } from './common/actions';
import { AppState } from './common/types';
import { delay } from './common/util';
import { dispatch } from './reduxology';

const RETRY_TIMEOUT = 250;
let socket: WebSocket;

export function connect(): Promise<AppState> {
  return new Promise((resolve) => {
    const url =
      (window.location.protocol === 'https:' ? 'wss:' : 'ws:') +
      '//' +
      window.location.host;
    socket = new WebSocket(url);
    if (!socket) {
      throw new Error('Could not connect to server');
    }
    socket.addEventListener('message', (e) => {
      const payload = JSON.parse(e.data);
      if (payload.type === ActionType.Hello) {
        resolve(payload.data);
      } else {
        dispatch(payload.type, payload.data);
      }
    });
    socket.addEventListener('close', async () => {
      console.log('Disconnected from server, retrying...');
      dispatch(ActionType.ConnectionStateChanged, { connected: false });
      await delay(RETRY_TIMEOUT);
      await connect();
      dispatch(ActionType.ConnectionStateChanged, { connected: true });
      console.log('Reconnected');
    });
  });
}

export function sendMessage(payload: {
  type: ActionType;
  data: unknown;
}): void {
  if (socket.readyState !== WebSocket.OPEN) {
    throw new Error('Not connected to server');
  }
  socket.send(JSON.stringify(payload));
}
