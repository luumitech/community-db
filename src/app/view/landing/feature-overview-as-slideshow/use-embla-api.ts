import { UseEmblaCarouselType } from 'embla-carousel-react';
import React from 'react';

type EmblaApi = UseEmblaCarouselType[1];

export const useEmblaApi = (emblaApi: EmblaApi) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onInit = React.useCallback((_emblaApi: NonNullable<EmblaApi>) => {
    setScrollSnaps(_emblaApi.scrollSnapList());
  }, []);

  const onSelect = React.useCallback((_emblaApi: NonNullable<EmblaApi>) => {
    setSelectedIndex(_emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollTo: NonNullable<EmblaApi>['scrollTo'] = React.useCallback(
    (...arg) => emblaApi?.scrollTo(...arg),
    [emblaApi]
  );

  const scrollNext: NonNullable<EmblaApi>['scrollNext'] = React.useCallback(
    (...arg) => emblaApi?.scrollNext(...arg),
    [emblaApi]
  );

  const scrollPrev: NonNullable<EmblaApi>['scrollPrev'] = React.useCallback(
    (...arg) => emblaApi?.scrollPrev(...arg),
    [emblaApi]
  );

  return {
    /** Currently selected image */
    selectedIndex,
    /** List of image indexes */
    scrollSnaps,
    /** Scroll to a particular image index */
    scrollTo,
    scrollNext,
    scrollPrev,
  };
};
