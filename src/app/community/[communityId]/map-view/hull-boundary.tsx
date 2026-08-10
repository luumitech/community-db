import { cn } from '@heroui/react';
import type { Polygon } from 'geojson';
import dynamic from 'next/dynamic';
import React from 'react';
import { useLocalStorage } from 'react-use';
import type { GeoCoord } from '~/graphql/generated/types';
import { lsFlags } from '~/lib/env';
import { Checkbox } from '~/view/base/checkbox';
import { ToolbarControl } from '~/view/base/map';
import { usePageContext } from './page-context';

const Polygon = dynamic(
  async () => {
    const mod = await import('react-leaflet');
    return mod.Polygon;
  },
  { ssr: false }
);

function toLeafletLatLngs(coordList: GeoCoord[]) {
  return coordList.map((coord) => [coord.lat, coord.lon] as L.LatLngTuple);
}

interface Props {}

/** Draw boundary around the points that are given in the input */
export const HullBoundary: React.FC<Props> = ({}) => {
  const { hullBoundary } = usePageContext();
  const [showBoundary = true, setShowBoundary] = useLocalStorage(
    lsFlags.mapViewShowBoundary,
    true
  );

  const hull = React.useMemo(() => {
    return toLeafletLatLngs(hullBoundary);
  }, [hullBoundary]);

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
