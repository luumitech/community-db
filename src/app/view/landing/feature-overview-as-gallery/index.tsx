'use client';
import { cn } from '@heroui/react';
import { motion } from 'motion/react';
import React from 'react';
import {
  useFeatureOverviewImageList,
  type ScreenshotEntry,
} from '../feature-overview-image-list';
import { DisplayTitle } from './display-title';
import { FullImage } from './fullimage';
import { Thumbnail } from './thumbnail';

interface Props {
  className?: string;
}

export const FeatureOverviewAsGallery: React.FC<Props> = ({ className }) => {
  const imageList = useFeatureOverviewImageList();
  const [image, setImage] = React.useState<ScreenshotEntry | null>(null);

  return (
    <div className={cn(className, 'p-3 bg-green-200')}>
      <DisplayTitle title="Feature Highlights" />
      <div className={cn('flex flex-wrap justify-center gap-4')}>
        {imageList.map((entry) => (
          <motion.div
            className={cn(
              // Each item takes 50% of the row minus half the gap
              'basis-[calc(100%-0.5rem)]',
              'sm:basis-[calc(50%-0.5rem)]',
              'xl:basis-[calc(33%-0.5rem)]'
            )}
            key={entry.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            // triggers once, when 50% in view
            viewport={{ once: true, amount: 0.5 }}
          >
            <Thumbnail
              className="h-full"
              {...entry}
              onPress={() => setImage(entry)}
            />
          </motion.div>
        ))}
      </div>
      {image && <FullImage {...image} onPress={() => setImage(null)} />}
    </div>
  );
};
