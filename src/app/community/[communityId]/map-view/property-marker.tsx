import { Marker } from '@adamscybot/react-leaflet-component-marker';
import { Link, cn } from '@heroui/react';
import React from 'react';
import { Popup } from 'react-leaflet';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { usePageContext } from './page-context';

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
      icon={
        <Icon
          className={cn(
            'text-success-600',
            isMember ? 'opacity-30' : 'opacity-0'
          )}
          size={size}
          icon="circle"
        />
      }
      position={locEntry.loc}
    >
      <Popup>
        <Link
          href={appPath('property', {
            path: { communityId: community.id, propertyId: locEntry.id },
          })}
          target="_blank"
        >
          {locEntry.address}
        </Link>
      </Popup>
    </Marker>
  );
};
