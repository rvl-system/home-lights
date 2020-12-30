declare module '@swiftcarrot/color-fns' {
  export function rgb2hsv(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; v: number };
  export function hsv2rgb(
    h: number,
    s: number,
    v: number
  ): { r: number; g: number; b: number };
  export function hsv2hsl(
    h: number,
    s: number,
    v: number
  ): { h: number; s: number; l: number };
}
