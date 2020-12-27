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

import { ActionType } from '../common/actions';
import { sendMessage } from '../connection';
import { createListener } from '../reduxology';

export const listeners = attachActionsToSocket({
  [ActionType.CreateRVLLight]: 'Failed to create light',
  [ActionType.EditLight]: 'Failed to edit light',
  [ActionType.DeleteLight]: 'Failed to delete light'
});

function attachActionsToSocket(spec: Record<string, string>) {
  const listeners = [];
  for (const action in spec) {
    listeners.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createListener(action as any, async (data) => {
        sendMessage({
          action: action as ActionType,
          data
        });
      })
    );
  }
  return listeners;
}
