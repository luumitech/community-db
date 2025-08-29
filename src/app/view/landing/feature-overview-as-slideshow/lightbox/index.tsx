'use client';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  cn,
} from '@heroui/react';
import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { type ScreenshotEntry } from '../../feature-overview-image-list';
import { useEmblaApi } from '../use-embla-api';
import { Slide } from './slide';

interface Props {
  className?: string;
  imageList: ScreenshotEntry[];
  disclosure: UseDisclosureReturn;
  startIndex: number;
  onClose?: (imageIndex: number) => void;
}

export const Lightbox: React.FC<Props> = ({
  className,
  imageList,
  disclosure,
  startIndex,
  onClose,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex }, []);
  const { scrollNext, scrollPrev, selectedIndex } = useEmblaApi(emblaApi);

  const modalClose = React.useCallback(() => {
    disclosure.onClose();
    onClose?.(selectedIndex);
  }, [disclosure, onClose, selectedIndex]);

  return (
    <Modal
      isOpen={disclosure.isOpen}
      size="full"
      scrollBehavior="inside"
      onClose={modalClose}
    >
      <ModalContent>
        {(onModalClose) => {
          return (
            <>
              {/**
               * Put in an empty header so ModalBody that is holding the image won't hide the
               * modal close button
               */}
              <ModalHeader />
              <ModalBody className="p-0 justify-center">
                <div
                  className={cn(className, 'overflow-x-hidden')}
                  ref={emblaRef}
                >
                  <div className="flex">
                    {imageList.map((slide) => (
                      <Slide key={slide.alt} {...slide} />
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-center items-center gap-3">
                <Button
                  isIconOnly
                  startContent={<Icon icon="back" />}
                  onPress={() => scrollPrev()}
                />
                <Button
                  isIconOnly
                  startContent={<Icon className="rotate-180" icon="back" />}
                  onPress={() => scrollNext()}
                />
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};
