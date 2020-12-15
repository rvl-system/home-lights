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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getItem<K, T extends Record<string, any>>(
  id: K,
  items: T[],
  lookup?: ((item: T) => boolean) | string
): T {
  if (!lookup) {
    lookup = (item) => item.id === id;
  }
  if (typeof lookup === 'string') {
    const key = lookup;
    lookup = (item) => item[key] === id;
  }
  const item = items.find(lookup);
  if (!item) {
    throw new Error(`Internal Error: could not find item ${id}`);
  }
  return item;
}
