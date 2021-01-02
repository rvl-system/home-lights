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

import { Color } from '../../../common/types';

export enum FormSchemaType {
  Group = 'Group',
  Text = 'text',
  Select = 'select',
  Range = 'range',
  Color = 'color',
  Divider = 'divider'
}

type LeafSchema = TextSchema | SelectSchema | RangeSchema | ColorSchema;
export type FormSchema = LeafSchema | GroupSchema;

export interface GroupSchema {
  type: FormSchemaType.Group;
  name: string;
  label: string;
  entries: LeafSchema[];
}

export interface TextSchema {
  type: FormSchemaType.Text;
  name: string;
  label: string;
  defaultValue?: string;
  inputPlaceholder?: string;
  unavailableValues?: string[];
}

export interface SelectSchema {
  type: FormSchemaType.Select;
  name: string;
  label: string;
  defaultValue: string;
  options: {
    value: string;
    label: string;
    disabled?: boolean;
  }[];
}

export interface RangeSchema {
  type: FormSchemaType.Range;
  name: string;
  label: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface ColorSchema {
  type: FormSchemaType.Color;
  name: string;
  label: string;
  defaultValue?: Color;
}
