import { colorSchemes } from '@nivo/colors';

export const COLOR_SCHEME: keyof typeof colorSchemes = 'pastel1';

/**
 * Get color of corresponding to a property within the datum
 *
 * @param index Color index
 * @returns Color in hex
 */
export function getItemColor(index: number) {
  const colorList = colorSchemes[COLOR_SCHEME] as string[];
  return colorList[index];
}
