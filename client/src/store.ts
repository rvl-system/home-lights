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

export type Animation = 'Rainbow' | 'Pulse' | 'Wave' | 'Color Cycle' | 'Solid';

interface IStore {
  power: boolean;
  brightness: number;
  animationType: Animation;
  animationParameters: {
    rainbow: {
      rate: number;
    };
    pulse: {
      rate: number;
      hue: number;
      saturation: number;
    };
    wave: {
      rate: number;
      waveHue: number;
      foregroundHue: number;
      backgroundHue: number;
    };
    colorCycle: {
      rate: number;
    };
    solid: {
      hue: number;
      saturation: number;
    };
  };
}

export const store: IStore = (window as any).state;
