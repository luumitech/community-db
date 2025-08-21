import { cn } from '@heroui/react';
import Image from 'next/image';
import React from 'react';
import { type ScreenshotEntry } from './image-list';

export const Screenshot: React.FC<ScreenshotEntry> = ({
  className,
  caption,
  ...props
}) => {
  const Caption = React.useCallback(
    (props: { text?: string }) => {
      if (!props.text) {
        return null;
      }

      return (
        <div className="relative">
          <div
            className={cn(
              'absolute bottom-0 w-full rounded-md',
              'flex items-center justify-center',
              'bg-foreground-600/60 backdrop-blur-md',
              'p-3'
            )}
          >
            <span className="text-center text-xl font-bold text-background">
              {props.text}
            </span>
          </div>
        </div>
      );
    },
    [caption]
  );

  return (
    <div className={cn(className, 'p-2 rounded-xl bg-foreground-700')}>
      <Image className="rounded-lg" {...props} />
      <Caption text={caption} />
    </div>
  );
};
