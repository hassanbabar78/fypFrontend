// utils/changeLottieColor.ts
export function changeLottieColor(lottieData: any, newColor: string) {
  const rgb = hexToRgb(newColor);
  const colorArray = [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1];

  function walkLayers(obj: any) {
    for (const key in obj) {
      if (key === "c" && Array.isArray(obj[key].k)) {
        obj[key].k = colorArray; // replace color
      } else if (typeof obj[key] === "object") {
        walkLayers(obj[key]);
      }
    }
  }

  const clone = JSON.parse(JSON.stringify(lottieData)); // avoid mutating original
  walkLayers(clone);
  return clone;
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}
