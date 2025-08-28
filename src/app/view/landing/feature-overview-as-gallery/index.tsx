'use client';
import { cn } from '@heroui/react';
import { motion } from 'motion/react';
import React from 'react';
import {
  useFeatureOverviewImageList,
  type ScreenshotEntry,
} from '../feature-overview-image-list';
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
      <div
        className={cn(
          'text-slate-700',
          'text-3xl sm:text-4xl font-bold text-center',
          'my-10'
        )}
      >
        Feature Highlights
      </div>
      <div
        className={cn(
          // 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
          // 'gap-3'
          'flex flex-wrap justify-center gap-4'
        )}
      >
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
