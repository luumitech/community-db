import { cn, Spacer } from '@heroui/react';
import React from 'react';
import { MapContextProvider } from '~/view/base/map';
import { StartImport } from '../start-import';
import { Map } from './map';
import { StatusBar } from './status-bar';

interface Props {
  className?: string;
}

export const MethodMap: React.FC<Props> = ({ className }) => {
  // const [pts, setPts] = React.useState<L.LatLng[]>([]);
  const [editMode, setEditMode] = React.useState(false);

  return (
    <>
      <MapContextProvider>
        <Map className={cn(className, 'grow')} setEditMode={setEditMode} />
      </MapContextProvider>
      {/* Negate the gap-2 specification on parent element */}
      <StatusBar className="mt-[-8px]" editMode={editMode} />
      <StartImport isDisabled={editMode} />
      <Spacer y={1} />
    </>
  );
};
