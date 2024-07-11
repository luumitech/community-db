import clsx from 'clsx';
import Image, { type ImageProps } from 'next/image';
import React from 'react';

interface Props extends ImageProps {
  className?: string;
  caption?: string;
}

export const Slide: React.FC<Props> = ({
  className,
  caption,
  alt,
  ...props
}) => {
  return (
    <div
      className={clsx(
        className,
        // Slide should cover 100% of viewport
        'flex-[0_0_100%]',
        'space-y-5'
      )}
    >
      <div className="m-auto w-[75%] max-w-4xl">
        <div className="p-2 rounded-xl bg-slate-700">
          <Image className="rounded-xl" alt={alt} {...props} />
        </div>
      </div>
      {caption && (
        <div className="text-center mb-5 text-xl font-bold text-slate-700">
          {caption}
        </div>
      )}
    </div>
  );
};
