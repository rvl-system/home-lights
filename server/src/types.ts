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

import { Actions, ActionType } from './common/actions';
import { Notification } from './common/types';

// Using unknown doesn't work, sadly
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionHandler<T extends ActionType> = (
  data: Actions[T]
) => Promise<Notification | void>;

export interface ActionHandlerEntry<T extends ActionType> {
  handler: ActionHandler<T>;
  reconcile: boolean;
}
