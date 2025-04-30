'use client';
import { useDisclosure } from '@heroui/react';
import React from 'react';
import { Carousel } from './carousel';
import { Lightbox } from './lightbox';

interface Props {
  className?: string;
}

export const GettingStarted: React.FC<Props> = ({ className }) => {
  const disclosure = useDisclosure();
  const [imageIndex, setImageIndex] = React.useState(0);

  const onSelect = React.useCallback(
    (imageIdx: number) => {
      setImageIndex(imageIdx);
      disclosure.onOpen();
    },
    [disclosure]
  );

  return (
    <div className={className}>
      <Carousel startIndex={imageIndex} onSelect={onSelect} />
      <Lightbox
        disclosure={disclosure}
        startIndex={imageIndex}
        onClose={setImageIndex}
      />
    </div>
  );
};
