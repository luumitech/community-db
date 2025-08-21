import { useTheme } from 'next-themes';
import { type ImageProps } from 'next/image';
import React from 'react';

export interface ScreenshotEntry extends ImageProps {
  caption?: string;
}

export function useImageList(): ScreenshotEntry[] {
  const [imageList, setImageList] = React.useState<ScreenshotEntry[]>([]);
  const { resolvedTheme: theme } = useTheme();

  const loadImage = React.useCallback(
    async (fileName: string) => {
      const image = await import(`./screenshots/${theme}/${fileName}`);
      return image;
    },
    [theme]
  );

  React.useEffect(() => {
    (async () => {
      if (theme) {
        setImageList([
          {
            alt: 'property-list',
            src: await loadImage('property-list.png'),
            caption: 'Easily search membership information within community',
          },
          {
            alt: 'property-detail',
            src: await loadImage('property-detail.png'),
            caption: 'Store and access membership information',
          },
          {
            alt: 'membership-editor',
            src: await loadImage('membership-editor.png'),
            caption: 'Keep record of event attendance',
          },
          {
            alt: 'occupant-editor',
            src: await loadImage('occupant-editor.png'),
            caption: 'Keep record of member contact information',
          },
          {
            alt: 'dashboard',
            src: await loadImage('dashboard.png'),
            caption: 'Visualize membership information',
          },
          {
            alt: 'export-xlsx',
            src: await loadImage('export-to-xlsx.png'),
            caption: 'Take entire database with you by exporting to Excel',
          },
        ]);
      }
    })();
  }, [theme, loadImage]);

  return imageList;
}
