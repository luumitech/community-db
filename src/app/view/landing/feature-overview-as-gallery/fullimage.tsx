import { cn } from '@heroui/react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { type ScreenshotEntry } from '../feature-overview-image-list';
import { DisplayImage } from './display-image';

interface FullImageProps extends ScreenshotEntry {
  onPress?: () => void;
}

export const FullImage: React.FC<FullImageProps> = ({ onPress, ...props }) => {
  React.useEffect(() => {
    /** Prevent body scroll when the full image is displayed. */
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          'fixed inset-0 bg-black/80',
          'flex items-center justify-center',
          'z-50 cursor-zoom-out'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          onPress?.();
          e.stopPropagation();
        }}
      >
        <motion.div
          className={cn('max-h-full max-w-full', 'cursor-zoom-out')}
          role="button"
          layoutId={props.id}
        >
          <DisplayImage
            className={cn(
              'max-h-[100vh] max-w-[100vw]',
              'sm:max-h-[calc(100vh-3em)] sm:max-w-[calc(100vw-3em)]'
            )}
            {...props}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
