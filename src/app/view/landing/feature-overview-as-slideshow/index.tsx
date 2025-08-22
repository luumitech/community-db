'use client';
import { useDisclosure } from '@heroui/react';
import React from 'react';
import { useFeatureOverviewImageList } from '../feature-overview-image-list';
import { Carousel } from './carousel';
import { Lightbox } from './lightbox';

interface Props {
  className?: string;
}

export const FeatureOverviewAsSlideshow: React.FC<Props> = ({ className }) => {
  const imageList = useFeatureOverviewImageList();
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
      <Carousel
        imageList={imageList}
        startIndex={imageIndex}
        onSelect={onSelect}
      />
      <Lightbox
        imageList={imageList}
        disclosure={disclosure}
        startIndex={imageIndex}
        onClose={setImageIndex}
      />
    </div>
  );
};
