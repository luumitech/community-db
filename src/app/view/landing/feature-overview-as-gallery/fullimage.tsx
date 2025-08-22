import { cn } from '@heroui/react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import React from 'react';
import { type ScreenshotEntry } from '../feature-overview-image-list';

interface FullImageProps extends ScreenshotEntry {
  onPress?: () => void;
}

export const FullImage: React.FC<FullImageProps> = ({
  id,
  alt,
  caption,
  onPress,
  ...props
}) => {
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
          'w-screen h-screen',
          'fixed top-0 left-0 right-0 bottom-0 bg-black/80',
          'flex items-center justify-center',
          'z-50'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="m-[min(5vw,5vh)] cursor-zoom-out"
          role="button"
          layoutId={id}
          onClick={(e) => {
            onPress?.();
            e.stopPropagation();
          }}
        >
          <div className="p-2 rounded-xl  bg-foreground-700 dark:bg-foreground-400">
            <Image className="rounded-t-lg" alt={alt} {...props} />
            {!!caption && (
              <div
                className={cn(
                  'rounded-b-lg',
                  'flex items-center justify-center',
                  'bg-foreground/60 backdrop-blur-md',
                  'p-3'
                )}
              >
                <span className="text-center text-xl font-bold text-background">
                  {caption}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
