'use client';
import clsx from 'clsx';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';
import CommunityDataImg from './community-data.png';
import DashboardImg from './dashboard.png';
import ExportToXlsxImg from './export-to-xlsx.png';
import OccupantEditorImg from './occupant-editor.png';
import PropertyDetailImg from './property-detail.png';
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
      className={clsx(className, 'overflow-hidden bg-green-200 py-6 space-y-3')}
      ref={emblaRef}
    >
      <div className="flex">
        <Slide
          alt="community-data"
          src={CommunityDataImg}
          caption="Address searchable by address or member name"
        />
        <Slide
          alt="property-detail"
          src={PropertyDetailImg}
          caption="Membership information at a glance"
        />
        <Slide
          alt="occupant-editor"
          src={OccupantEditorImg}
          caption="Easy to modify any information"
        />
        <Slide
          alt="dashboard"
          src={DashboardImg}
          caption="Visualize membership information"
        />
        <Slide
          alt="export-xlsx"
          src={ExportToXlsxImg}
          caption="Export to Excel"
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
