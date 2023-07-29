/**
 * Lightens or darkens a hexadecimal color.
 *
 * @param {string} color - The hexadecimal color to adjust. Must be in the form '#RRGGBB'.
 * @param {number} percent - The percentage to adjust the color.
 *  Positive values lighten the color, while negative values darken it.
 *  Must be a value between -1 and 1.
 *
 * @return {string} The adjusted color in hexadecimal format.
 */
const adjustColorBrightness = (color: string, percent: number) => {
  // Check if the color is a valid hexadecimal number
  if (!/^#[0-9a-f]{6}$/i.test(color)) {
    throw new Error(
      'Invalid color. Must be a hexadecimal color in the form #RRGGBB',
    );
  }

  // Check if the percent is between -1 and 1
  if (percent < -1 || percent > 1) {
    throw new Error('Invalid percent. Must be a value between -1 and 1');
  }

  const num = parseInt(color.slice(1), 16);
  const amount = Math.round(255 * Math.abs(percent)); // Convert percentage to an absolute amount

  let r = Math.min(
    255,
    Math.max(0, (num >> 16) + (percent > 0 ? amount : -amount)),
  );
  let b = Math.min(
    255,
    Math.max(0, ((num >> 8) & 0x00ff) + (percent > 0 ? amount : -amount)),
  );
  let g = Math.min(
    255,
    Math.max(0, (num & 0x0000ff) + (percent > 0 ? amount : -amount)),
  );

  return `#${(g | (b << 8) | (r << 16)).toString(16).padStart(6, '0')}`;
};

export default adjustColorBrightness;
