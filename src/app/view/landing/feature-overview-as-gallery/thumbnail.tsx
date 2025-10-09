import { cn } from '@heroui/react';
import { motion } from 'motion/react';
import React from 'react';
import { type ScreenshotEntry } from '../feature-overview-image-list';
import { DisplayCaption } from './display-caption';
import { DisplayImage } from './display-image';

interface ThumbnailProps extends ScreenshotEntry {
  onPress?: () => void;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  className,
  onPress,
  caption,
  ...props
}) => {
  return (
    <motion.div
      className={cn(className, 'cursor-zoom-in')}
      role="button"
      layoutId={props.id}
      onClick={() => onPress?.()}
    >
      <DisplayImage
        className={cn(
          'h-full',
          'shadow-md shadow-slate-400 dark:shadow-background'
        )}
        {...props}
      >
        <DisplayCaption caption={caption} />
      </DisplayImage>
    </motion.div>
  );
};
