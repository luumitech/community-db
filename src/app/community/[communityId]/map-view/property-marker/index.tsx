import { Marker } from '@adamscybot/react-leaflet-component-marker';
import { cn } from '@heroui/react';
import React from 'react';
import { Popup } from 'react-leaflet';
import { appLabel, appPath } from '~/lib/app-path';
import { Link } from '~/view/base/link';
import { usePageContext } from '../page-context';
import { MarkerIcon } from './marker-icon';

export { MarkerIcon } from './marker-icon';

export interface LocEntry {
  id: string;
  address: string;
  loc: L.LatLngExpression;
}

interface Props {
  locEntry: LocEntry;
  isMember?: boolean;
  zoom?: number;
}

export const PropertyMarker: React.FC<Props> = ({
  locEntry,
  isMember,
  zoom,
}) => {
  const { community } = usePageContext();
  const communityId = community.id;
  const propertyId = locEntry.id;

  const size = React.useMemo(() => {
    if (!zoom) {
      return 0;
    } else if (zoom >= 18) {
      return 28;
    } else if (zoom >= 17) {
      return 20;
    } else if (zoom >= 16) {
      return 16;
    } else if (zoom >= 15) {
      return 8;
    } else if (zoom >= 14) {
      return 4;
    } else {
      return 0;
    }
  }, [zoom]);

  if (!size) {
    return null;
  }

  return (
    <Marker
      icon={<MarkerIcon size={size} isMember={!!isMember} />}
      position={locEntry.loc}
    >
      <Popup>
        <div>
          <div className="mb-1 text-medium">{locEntry.address}</div>
          <div className="flex">
            <Link
              href={appPath('property', {
                path: { communityId, propertyId },
              })}
              tooltip={appLabel('property')}
              tooltipProps={{ isFixed: true }}
              iconOnly={{
                icon: 'eye',
                openInNewWindow: true,
              }}
            />
            <Link
              href={appPath('propertyModify', {
                path: { communityId, propertyId },
              })}
              tooltip={appLabel('propertyModify')}
              tooltipProps={{ isFixed: true }}
              iconOnly={{
                icon: 'edit',
              }}
            />
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
