declare module '@swiftcarrot/color-fns' {
  export function rgb2hsv(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; v: number };
}
