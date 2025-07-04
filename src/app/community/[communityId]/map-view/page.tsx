'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import { MoreMenu } from '../common/more-menu';

// Load leaflet dynamically to avoid 'undefined window' error
const Map = dynamic(
  async () => {
    const { Map } = await import('./map');
    return Map;
  },
  { ssr: false }
);

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function MapView({ params }: RouteArgs) {
  const { communityId } = params;

  if (communityId == null) {
    return null;
  }

  return (
    <>
      <MoreMenu communityId={communityId} />
      <Map />
    </>
  );
}
