import { Checkbox, cn } from '@heroui/react';
import * as turf from '@turf/turf';
import type { MultiPolygon, Polygon } from 'geojson';
import dynamic from 'next/dynamic';
import React from 'react';
import { useMap } from 'react-leaflet';
import { useLocalStorage } from 'usehooks-ts';
import { lsFlags } from '~/lib/env-var';
import { ToolbarControl } from '~/view/base/map';

const Polygon = dynamic(
  async () => {
    const mod = await import('react-leaflet');
    return mod.Polygon;
  },
  { ssr: false }
);

function toLeafletLatLngs(geojson: Polygon | MultiPolygon) {
  const coords = geojson.coordinates[0]; // Outer ring
  return coords.map(
    (coord) =>
      // Swap [lng, lat] to [lat, lng]
      [coord[1], coord[0]] as L.LatLngTuple
  );
}

function toTurf(bounds: L.LatLngBoundsLiteral) {
  const points = bounds.map((coord) =>
    // Note: Turf uses [lng, lat]
    turf.point([coord[1], coord[0]])
  );
  return points;
}

interface Props {
  positions: L.LatLngBoundsLiteral;
}

/** Draw boundary around the points that are given in the input */
export const HullBoundary: React.FC<Props> = ({ positions }) => {
  const map = useMap();
  const [hull, setHull] = React.useState<L.LatLngBoundsLiteral>();
  const [showBoundary, setShowBoundary] = useLocalStorage(
    lsFlags.mapViewShowBoundary,
    true
  );

  React.useEffect(() => {
    // Convert to Turf.js points
    const points = turf.featureCollection(toTurf(positions));

    // Compute convex hull
    const convexPts = turf.convex(points, { concavity: 6 });
    if (convexPts) {
      const hullPts = turf.buffer(convexPts, 50, { units: 'meters' });
      if (hullPts) {
        const polygon = toLeafletLatLngs(hullPts.geometry);
        setHull(polygon);
      }
    }
  }, [map, positions]);

  return (
    <>
      {hull != null && showBoundary && (
        <Polygon
          pathOptions={{ color: '#0078A8', fillColor: 'transparent' }}
          positions={hull}
        />
      )}
      <ToolbarControl className="p-2" position="topright">
        {hull != null && (
          <Checkbox
            classNames={{
              base: cn('inline-flex bg-content1', 'rounded-lg'),
            }}
            size="sm"
            isSelected={showBoundary}
            onValueChange={setShowBoundary}
          >
            Show Boundary
          </Checkbox>
        )}
      </ToolbarControl>
    </>
  );
};
