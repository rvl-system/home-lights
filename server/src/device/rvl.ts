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

import { SetLightStateRequest } from '../common/types';

export async function init(): Promise<void> {
  // Devices are initialized on a per-channel basis, so we do nothing here
  console.log('RVL devices initialized');
}

export async function setLightState(
  lightState: SetLightStateRequest
): Promise<void> {
  console.log(lightState);
}