/*
Copyright (c) Bryan Hughes <bryan@nebri.us>

This file is part of Home Patterns.

Home Patterns is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Home Patterns is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Home Patterns.  If not, see <http://www.gnu.org/licenses/>.
*/

import { ActionType } from '../common/actions';
import { createPattern, editPattern, deletePattern } from '../db/patterns';
import { ActionHandlerEntry } from '../types';

export function createPatternHandlers(): Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ActionHandlerEntry<any>
> {
  return {
    [ActionType.CreatePattern]: { handler: createPattern, reconcile: true },
    [ActionType.EditPattern]: { handler: editPattern, reconcile: true },
    [ActionType.DeletePattern]: { handler: deletePattern, reconcile: true }
  };
}
