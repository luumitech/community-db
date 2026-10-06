'use client';
import React from 'react';
import {
  ExportControl,
  FitBound,
  MapContainer,
  MapEventListener,
} from '~/view/base/map';
import { hasCoordinates } from '~/view/base/map/map-util';
import { ExportGoogleMap } from './export-google-map';
import { Footer } from './footer';
import { HullBoundary } from './hull-boundary';
import { MapReset } from './map-reset';
import { usePageContext } from './page-context';
import { PropertyMarker } from './property-marker';

interface Props {
  className?: string;
}

export const MapView: React.FC<Props> = ({ className }) => {
  const { matchPropertyWithGps, hullBoundary } = usePageContext();
  const [zoom, setZoom] = React.useState<number>();

  /** Calculate coordinate(s) to zoom map to */
  const positions = React.useMemo(() => {
    const matchedLoc = matchPropertyWithGps.map((entry) => entry.loc);
    if (hasCoordinates(matchedLoc)) {
      return matchedLoc;
    }
    // If no properties matched, then use hullboundary, if available
    return hullBoundary;
  }, [matchPropertyWithGps, hullBoundary]);

  return (
    <MapContainer
      className={className}
      zoom={zoom}
      zoomSnap={0}
      zoomDelta={0.25}
      scrollWheelZoom
    >
      <MapReset positions={positions} />
      <ExportControl fileName="map.png">
        <ExportGoogleMap />
      </ExportControl>
      <MapEventListener onZoomChange={setZoom} />
      <FitBound bounds={positions} />
      <HullBoundary />
      {matchPropertyWithGps.map((entry) => (
        <PropertyMarker key={entry.id} locEntry={entry} zoom={zoom} isMember />
      ))}
      <Footer />
    </MapContainer>
  );
};
