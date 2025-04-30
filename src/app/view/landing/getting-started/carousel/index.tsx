'use client';
import { cn } from '@heroui/react';
import Autoplay from 'embla-carousel-autoplay';
import ClassNames from 'embla-carousel-class-names';
import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';
import { imageList } from '../image-list';
import { useEmblaApi } from '../use-embla-api';
import { Slide } from './slide';
import { DotButton } from './slide-button';

interface Props {
  className?: string;
  startIndex: number;
  onSelect?: (imageIdx: number) => void;
}

export const Carousel: React.FC<Props> = ({
  className,
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
      className={cn(className, 'overflow-hidden bg-green-200 py-6 space-y-3')}
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
      <div className="flex justify-center items-center gap-1">
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
