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

import { getLights, reconcile as reconcileLights } from './db/lights';
import { getPatterns } from './db/patterns';
import { reconcile as reconcileScenes } from './db/scenes';
import { getZones } from './db/zones';
import { reconcile as reconcileDevice } from './device';

// Order matters! Switching these will leave us in an inconsistent state
export async function reconcile(): Promise<void> {
  // Reconcile lights
  const zones = getZones();
  await reconcileLights(zones);

  // Reconcile scenes
  const patterns = getPatterns();
  const lights = getLights();
  await reconcileScenes(zones, patterns, lights);

  // Reconcile device state
  await reconcileDevice(zones);
}
