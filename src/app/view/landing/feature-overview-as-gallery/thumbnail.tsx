import { cn } from '@heroui/react';
import { motion } from 'motion/react';
import React from 'react';
import { type ScreenshotEntry } from '../feature-overview-image-list';
import { ImageWithFrame } from './image-with-frame';

interface ThumbnailProps extends ScreenshotEntry {
  onPress?: () => void;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  className,
  onPress,
  ...props
}) => {
  return (
    <motion.div
      className={cn(className, 'cursor-zoom-in')}
      role="button"
      layoutId={props.id}
      onClick={() => onPress?.()}
    >
      <ImageWithFrame
        className="h-full shadow-lg shadow-slate-400"
        {...props}
      />
    </motion.div>
  );
};
