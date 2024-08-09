import clsx from 'clsx';
import { UseEmblaCarouselType } from 'embla-carousel-react';
import React from 'react';

type EmblaApi = UseEmblaCarouselType[1];

export const useDotButton = (emblaApi: EmblaApi) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!emblaApi) {
        return;
      }
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

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

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  selected?: boolean;
}

export const DotButton: React.FC<Props> = ({ selected, ...props }) => {
  return (
    <button
      className={clsx(
        'w-3 h-3 rounded-full border-2 border-gray-300',
        selected ? 'border-slate-500 bg-slate-500' : 'border-gray-300'
      )}
      {...props}
    />
  );
};
