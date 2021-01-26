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

import { rgb2hsv } from '@swiftcarrot/color-fns';
import { colorTemperature2rgb } from 'color-temperature';
import { Color, ColorType, HSVColor } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lookupItem<K, T extends Record<string, any>>(
  id: K,
  items: T[],
  lookup?: ((item: T) => boolean) | string
): T | undefined {
  if (!lookup) {
    lookup = (item) => item.id === id;
  }
  if (typeof lookup === 'string') {
    const key = lookup;
    lookup = (item) => item[key] === id;
  }
  return items.find(lookup);
}

/**
 * Checks whether or not an item an item exists in the array that matches the
 * supplied item ID.
 *
 * @param id The ID of the item to search for
 * @param items The list of items to search
 * @param lookup Either the name of the ID property on each item in the list to
 *   test against, or a test function that receives the item and returns whether
 *   or not it matches. Default is "id"
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasItem<K, T extends Record<string, any>>(
  id: K,
  items: T[],
  lookup?: ((item: T) => boolean) | string
): boolean {
  return !!lookupItem(id, items, lookup);
}

/**
 * Retrieves an item from array that matches the supplied item ID, or throws an
 * error if it's not found.
 *
 * @param id The ID of the item to search for
 * @param items The list of items to search
 * @param lookup Either the name of the ID property on each item in the list to
 *   test against, or a test function that receives the item and returns whether
 *   or not it matches. Default is "id"
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getItem<K, T extends Record<string, any>>(
  id: K,
  items: T[],
  lookup?: ((item: T) => boolean) | string
): T {
  const item = lookupItem(id, items, lookup);
  if (!item) {
    throw new Error(`Internal Error: could not find item ${id}`);
  }
  return item;
}

type Value = unknown[] | Record<string, unknown> | Primitive;
type Primitive = string | number | boolean | null | undefined;

/**
 * Iterates over nested objects/arrays and allows primitives to be mapped from
 * one value to another.
 */
export function deepMap(
  value: Value,
  cb: (value: Primitive) => Primitive
): Value {
  if (Array.isArray(value)) {
    const newValue = [];
    for (let i = 0; i < value.length; i++) {
      newValue[i] = deepMap(value[i] as Value, cb);
    }
    return newValue;
  } else if (typeof value === 'object' && value !== null) {
    const newValue: Record<string, unknown> = {};
    for (const prop in value) {
      newValue[prop] = deepMap(value[prop] as Value, cb);
    }
    return newValue;
  } else {
    return cb(value);
  }
}

/**
 * Delays for `time` milliseconds
 */
export async function delay(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Get a color in HSV format, regardless of input format
 */
export function getHSVColor(color: Color): HSVColor {
  if (color.type === ColorType.HSV) {
    return color;
  }
  const rgb = colorTemperature2rgb(color.temperature);
  const hsv = rgb2hsv(rgb.red, rgb.green, rgb.blue);
  return { type: ColorType.HSV, hue: hsv.h, saturation: hsv.s / 100 };
}

/**
 * Formats an hour/minute pair into a string of the format XX:XX
 */
export function formatTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;
}
