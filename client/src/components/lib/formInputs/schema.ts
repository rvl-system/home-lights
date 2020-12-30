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
  Text = 'text',
  Select = 'select',
  Range = 'range',
  Color = 'color',
  Label = 'label',
  Divider = 'divider'
}

export type FormSchema =
  | TextSchema
  | SelectSchema
  | RangeSchema
  | ColorSchema
  | LabelSchema;

export interface TextSchema {
  type: FormSchemaType.Text;
  name: string;
  description: string;
  defaultValue?: string;
  inputPlaceholder?: string;
  unavailableValues?: string[];
}

export interface SelectSchema {
  type: FormSchemaType.Select;
  name: string;
  description: string;
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
  description: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface ColorSchema {
  type: FormSchemaType.Color;
  name: string;
  description: string;
  defaultValue?: Color;
}

export interface LabelSchema {
  type: FormSchemaType.Label;
  label: string;
}
