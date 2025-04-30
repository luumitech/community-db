import { cn } from '@heroui/react';
import Image from 'next/image';
import React from 'react';
import { type SlideProps } from '../image-list';

export const Slide: React.FC<SlideProps> = ({
  className,
  caption,
  alt,
  ...props
}) => {
  return (
    <div className={cn(className, 'flex-[0_0_100%]', 'space-y-5 px-2')}>
      <div className={cn('p-2 rounded-xl bg-slate-700')}>
        <Image className="rounded-lg" alt={alt} {...props} />
      </div>
      {caption && (
        <div className="text-center text-xl font-bold text-foreground-700">
          {caption}
        </div>
      )}
    </div>
  );
};
