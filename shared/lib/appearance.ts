export type Appearance = { theme: 'light' | 'dark'; locale: 'ru' | 'en'; accent: string; filterLayout: 'grid' | 'list' };
export const appearanceCookie = 'artlab-appearance';
export const defaultAppearance: Appearance = { theme: 'light', locale: 'ru', accent: '#7c3aed', filterLayout: 'grid' };

/** Translation for non-React operations and upload errors. */
export function translate(ru: string, en: string) {
  return typeof document !== 'undefined' && document.documentElement.lang === 'en' ? en : ru;
}

export function parseAppearance(value?: string): Appearance {
  try {
    const parsed = JSON.parse(decodeURIComponent(value ?? ''));
    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      locale: parsed.locale === 'en' ? 'en' : 'ru',
      accent: typeof parsed.accent === 'string' && /^#[0-9a-f]{6}$/i.test(parsed.accent) ? parsed.accent : defaultAppearance.accent,
      filterLayout: parsed.filterLayout === 'list' ? 'list' : 'grid',
    };
  } catch { return defaultAppearance; }
}

/** Darken very light custom colours until white button text has 4.5:1 contrast. */
export function accentTokens(hex: string, theme: Appearance['theme']) {
  const rgb = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255);
  const luminance = (values: number[]) => values.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  while (luminance(rgb) > .183) for (let i = 0; i < 3; i++) rgb[i] *= .97;
  const max = Math.max(...rgb), min = Math.min(...rgb), delta = max - min, lightness = (max + min) / 2;
  let hue = 0;
  if (delta) hue = ((max === rgb[0] ? (rgb[1] - rgb[2]) / delta : max === rgb[1] ? (rgb[2] - rgb[0]) / delta + 2 : (rgb[0] - rgb[1]) / delta + 4) * 60 + 360) % 360;
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) * 100 : 0;
  const primary = `${hue.toFixed(1)} ${saturation.toFixed(1)}% ${(lightness * 100).toFixed(1)}%`;
  return { '--primary': primary, '--ring': primary, '--kit-shadow-color': `hsl(${hue} ${saturation * .65}% ${theme === 'light' ? 65 : 28}%)`, '--kit-selected': `hsl(${hue} ${saturation * .5}% ${theme === 'light' ? 92 : 22}%)` };
}
