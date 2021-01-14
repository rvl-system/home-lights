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

declare module 'node-lifx-lan' {
  export class Device {
    public ip: string;

    public mac: string;

    public deviceInfo: {
      label: string;
      vendorId: number;
      vendorName: string;
      productId: number;
      productName: string;
      hwVersion: number;
      features: {
        color: boolean;
        infrared: boolean;
        multizone: boolean;
        chain: boolean;
      };
      location: {
        guid: string;
        label: string;
        updated: Date;
      };
      group: {
        guid: string;
        label: string;
        updated: Date;
      };
    };

    public async turnOff(opts: { duration: number }): Promise<void>;

    public async turnOn(opts: {
      color: LifxLanColorHSB;
      duration: number;
    }): Promise<void>;
  }

  export async function discover(): Promise<Device[]>;

  export interface LifxLanColorHSB {
    hue: number; // 0-1
    saturation: number; // 0-1
    brightness: number; // 0-1
    kelvin?: number; // 1500 to 9000.
  }
}
