'use client';
import React from 'react';
import { FeatureOverviewAsGallery } from './feature-overview-as-gallery';
import { Hero } from './hero';
import { SignUpReason } from './sign-up-reason';

interface Props {
  className?: string;
}

export const Landing: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Hero />
      <FeatureOverviewAsGallery />
      <SignUpReason />
    </div>
  );
};
