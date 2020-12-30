declare module 'color-temperature' {
  export function colorTemperature2rgb(
    kelvin: number
  ): { red: number; blue: number; green: number };
}
