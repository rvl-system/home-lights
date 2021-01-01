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
import { createListener, dispatch } from '../reduxology';

const DEBOUNCE_INTERVAL = 33;

export const listeners = [
  ...connectActions({
    [ActionType.CreateZone]: 'Failed to create zone',
    [ActionType.EditZone]: 'Failed to edit zone',
    [ActionType.DeleteZone]: 'Failed to delete zone',

    [ActionType.CreateSchedule]: 'Failed to create schedule',
    [ActionType.EditSchedule]: 'Failed to edit schedule',

    [ActionType.CreateScene]: 'Failed to create scene',
    [ActionType.EditScene]: 'Failed to edit scene',
    [ActionType.DeleteScene]: 'Failed to delete scene',

    [ActionType.CreatePattern]: 'Failed to create pattern',
    [ActionType.EditPattern]: 'Failed to edit pattern',
    [ActionType.DeletePattern]: 'Failed to delete pattern',

    [ActionType.CreateRVLLight]: 'Failed to create light',
    [ActionType.EditLight]: 'Failed to edit light',
    [ActionType.DeleteLight]: 'Failed to delete light',

    [ActionType.SetZoneScene]: 'Failed to set the zone scene',
    [ActionType.SetZonePower]: 'Failed to set the zone power'
  }),
  ...connectDebouncedActions({
    [ActionType.SetZoneBrightness]: 'Failed to set the zone brightness'
  })
];

function connectActions(spec: Record<string, string>) {
  const listeners = [];
  for (const action in spec) {
    listeners.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createListener(action as any, async (data) => {
        try {
          sendMessage({
            type: action as ActionType,
            data
          });
        } catch {
          dispatch(ActionType.Notify, {
            severity: 'error',
            message: spec[action]
          });
        }
      })
    );
  }
  return listeners;
}

const debounceMap = new Map<string, unknown>();
function connectDebouncedActions(spec: Record<string, string>) {
  const listeners = [];
  for (const action in spec) {
    let isSending = false;
    listeners.push(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createListener(action as any, async (data) => {
        function sendAction() {
          try {
            sendMessage({
              type: action as ActionType,
              data: debounceMap.get(action)
            });
          } catch {
            dispatch(ActionType.Notify, {
              severity: 'error',
              message: spec[action]
            });
          }
        }
        debounceMap.set(action, data);
        if (!isSending) {
          isSending = true;
          setTimeout(() => {
            isSending = false;
            sendAction();
          }, DEBOUNCE_INTERVAL);
        }
      })
    );
  }
  return listeners;
}
