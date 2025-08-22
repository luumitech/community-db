import { cn } from '@heroui/react';
import { motion } from 'motion/react';
import Image from 'next/image';
import React from 'react';
import { type ScreenshotEntry } from '../feature-overview-image-list';

interface ThumbnailProps extends ScreenshotEntry {
  onPress?: () => void;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  className,
  id,
  alt,
  caption,
  onPress,
  ...props
}) => {
  return (
    <motion.div
      role="button"
      className={cn(className, 'cursor-zoom-in')}
      layoutId={id}
      onClick={() => onPress?.()}
    >
      <div className="p-2 rounded-xl bg-foreground-700 dark:bg-foreground-400">
        <Image className="rounded-lg" alt={alt} {...props} />
        {!!caption && (
          <div className="relative">
            <div
              className={cn(
                'absolute bottom-0 w-full rounded-b-md',
                'flex items-center justify-center',
                'bg-foreground/60 backdrop-blur-md',
                'p-3'
              )}
            >
              <span className="text-center text-xl font-bold text-background">
                {caption}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
