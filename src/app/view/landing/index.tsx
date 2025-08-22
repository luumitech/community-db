'use client';
import { cn } from '@heroui/react';
import React from 'react';
import { FeatureOverviewAsGallery } from './feature-overview-as-gallery';
import { FeatureOverviewAsSlideshow } from './feature-overview-as-slideshow';
import { Hero } from './hero';
import { SignUpReason } from './sign-up-reason';

interface Props {
  className?: string;
}

export const Landing: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className)}>
      <Hero />
      <FeatureOverviewAsGallery />
      {/* <FeatureOverviewAsSlideshow /> */}
      <SignUpReason />
    </div>
  );
};
