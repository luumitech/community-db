import { useTheme } from 'next-themes';
import React from 'react';
import {
  screenshotConfig,
  type ScreenshotEntry,
  type ScreenshotId,
} from './_type';

export type * from './_type';

/**
 * Load list of images to be used in the feature overview section.
 *
 * Different images are loaded based on the current theme
 */
export function useFeatureOverviewImageList(): ScreenshotEntry[] {
  const [imageList, setImageList] = React.useState<ScreenshotEntry[]>([]);
  const { resolvedTheme: theme } = useTheme();

  const loadImage = React.useCallback(
    async (imageId: ScreenshotId): Promise<ScreenshotEntry> => {
      const src = await import(`./screenshots/${theme}/${imageId}.png`);
      return {
        id: imageId,
        src,
        ...screenshotConfig[imageId],
      };
    },
    [theme]
  );

  React.useEffect(() => {
    (async () => {
      if (theme) {
        const images = await Promise.all(
          Object.keys(screenshotConfig).map((key) =>
            loadImage(key as ScreenshotId)
          )
        );
        setImageList(images);
      }
    })();
  }, [theme, loadImage]);

  return imageList;
}
