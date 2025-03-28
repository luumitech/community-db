/* eslint-disable no-console */
import { favicons, type FaviconImage, type FaviconOptions } from 'favicons';
import fs from 'fs';
import path from 'path';
import { mkdir } from '~/lib/file-util';

const defaultConfig: FaviconOptions = {
  /**
   * For more information on the configuration options, see:
   *
   * https://github.com/itgalaxy/favicons#Usage
   */
  icons: {
    /**
     * Platform Options:
     *
     * - Offset - offset in percentage
     * - Background:
     *
     *   - False - use default
     *   - True - force use default, e.g. set background for Android icons
     *   - Color - set background for the specified icons
     */
    android: true, // Create Android homescreen icon.
    appleIcon: {
      sizes: [{ width: 180, height: 180 }],
      transparent: true,
      rotate: false,
      background: '#74DFA2',
    }, // Create Apple touch icons.
    appleStartup: false, // Create Apple startup images.
    favicons: true, // Create regular favicons.
    windows: false, // Create Windows 8 tile icons.
    yandex: false, // Create Yandex browser icon.
  },
};

/**
 * Generate favicons from a PNG file.
 *
 * @param input - The input PNG file.
 * @param outputDir - The output directory for the generated icons.
 * @param iconNames - Types of icons to generate
 */
export async function genFavicon(
  input: string,
  outputDir: string,
  iconNames: string[]
) {
  const resp = await favicons(input, defaultConfig);
  const { images } = resp;
  // console.log({ images });

  // Make sure outputDir is available
  mkdir(outputDir);

  iconNames.forEach((iconName) => {
    switch (iconName) {
      case 'favicon.ico':
        writeIcon(images, 'favicon.ico', path.join(outputDir, 'favicon.ico'));
        break;

      case 'apple-icon.png':
        writeIcon(
          images,
          'apple-touch-icon.png',
          path.join(outputDir, 'apple-icon.png')
        );
        break;

      case 'icon.png':
        writeIcon(
          images,
          'android-chrome-512x512.png',
          path.join(outputDir, 'icon.png')
        );
        break;
    }
  });
}

function writeIcon(images: FaviconImage[], imageKey: string, destFn: string) {
  const item = images.find((image) => image.name === imageKey);
  if (!item) {
    console.log(`${imageKey} is not a valid image key`);
    return;
  }

  fs.writeFileSync(destFn, item.contents);
  console.log(`Added ${destFn}`);
}
