import { type ImageProps } from 'next/image';

export const screenshotConfig = {
  ['import-community-map']: {
    caption: 'Draw boundary on map to import addresses into database',
    alt: 'Import community with map',
    imageClassName: 'scale-[1.3] origin-top-left object-left',
  },
  ['property-list']: {
    caption: 'Easily search membership information within community',
    alt: 'Property list screenshot',
  },
  ['property-detail']: {
    caption: 'Store and access membership information',
    alt: 'Property detail screenshot',
  },
  ['membership-editor']: {
    caption: 'Keep record of event attendance',
    alt: 'Membership editor screenshot',
  },
  ['occupant-editor']: {
    caption: 'Keep record of member contact information',
    alt: 'Occupant editor screenshot',
  },
  ['dashboard']: {
    caption: 'Visualize membership information',
    alt: 'Dashboard screenshot',
  },
  ['export-to-xlsx']: {
    caption: 'Take entire database with you by exporting to Excel',
    alt: 'Export screenshot',
  },
} as const;

export type ScreenshotId = keyof typeof screenshotConfig;

export interface ScreenshotEntry extends ImageProps {
  id: ScreenshotId;
  alt: string;
  caption?: string;
  /**
   * Additional classnames to pass into image
   *
   * Useful, if you want to scale the input image, for example:
   *
   * ```css
   * img {
   *   transform: scale(2);
   *   transform-origin: top left;
   *   object-position: left;
   * }
   * ```
   */
  imageClassName?: string;
}
