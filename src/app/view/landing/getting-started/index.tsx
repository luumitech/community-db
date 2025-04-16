'use client';
import { cn } from '@heroui/react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';
import DashboardImg from '../images/dashboard.png';
import ExportToXlsxImg from '../images/export-to-xlsx.png';
import MembershipEditorImg from '../images/membership-editor.png';
import occupantEditorImg from '../images/occupant-editor.png';
import PropertyDetailImg from '../images/property-detail.png';
import propertyListImg from '../images/property-list.png';
import { Slide } from './slide';
import { DotButton, useDotButton } from './slide-button';

interface Props {
  className?: string;
}

export const GettingStarted: React.FC<Props> = ({ className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <div
      className={cn(className, 'overflow-hidden bg-green-200 py-6 space-y-3')}
      ref={emblaRef}
    >
      <div className="flex">
        <Slide
          alt="property-list"
          src={propertyListImg}
          caption="Easily search membership information within community"
        />
        <Slide
          alt="property-detail"
          src={PropertyDetailImg}
          caption="Store and access membership information"
        />
        <Slide
          alt="membership-editor"
          src={MembershipEditorImg}
          caption="Keep record of event attendance"
        />
        <Slide
          alt="occupant-editor"
          src={occupantEditorImg}
          caption="Keep record of member contact information"
        />
        <Slide
          alt="dashboard"
          src={DashboardImg}
          caption="Visualize membership information"
        />
        <Slide
          alt="export-xlsx"
          src={ExportToXlsxImg}
          caption="Take entire database with you by exporting to Excel"
        />
      </div>
      <div className="flex justify-center items-center gap-1">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </div>
  );
};
