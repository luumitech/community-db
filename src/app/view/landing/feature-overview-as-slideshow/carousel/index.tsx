'use client';
import Autoplay from 'embla-carousel-autoplay';
import ClassNames from 'embla-carousel-class-names';
import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { type ScreenshotEntry } from '../../feature-overview-image-list';
import { useEmblaApi } from '../use-embla-api';
import { Slide } from './slide';
import { DotButton } from './slide-button';

interface Props {
  className?: string;
  imageList: ScreenshotEntry[];
  startIndex: number;
  onSelect?: (imageIdx: number) => void;
}

export const Carousel: React.FC<Props> = ({
  className,
  imageList,
  startIndex,
  onSelect,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex }, [
    Autoplay(),
    ClassNames(),
  ]);
  const { selectedIndex, scrollSnaps, scrollTo } = useEmblaApi(emblaApi);

  return (
    <div
      className={twMerge(
        'space-y-3 overflow-hidden bg-green-200 py-6',
        className
      )}
      ref={emblaRef}
    >
      <div className="flex">
        {imageList.map((slide) => (
          <Slide
            key={slide.alt}
            {...(onSelect && { onClick: () => onSelect(selectedIndex) })}
            {...slide}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-1">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => scrollTo(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </div>
  );
};
