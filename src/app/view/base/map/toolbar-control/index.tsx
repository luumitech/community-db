import { cn } from '@heroui/react';
import React from 'react';
import { useMap } from 'react-leaflet';
import { useMapContext } from '~/view/base/map';

const POSITION_CLASSES: Record<L.ControlPosition, string> = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

interface Props {
  className?: string;
  position: L.ControlPosition;
  /** Prepend this control ahead of existing controls in the same position */
  prepend?: boolean;
}

export const ToolbarControl: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  position,
  prepend,
  children,
}) => {
  const { L } = useMapContext();
  const map = useMap();
  const [portalRoot, setPortalRoot] = React.useState<HTMLDivElement>(
    document.createElement('div')
  );
  const positionClass = POSITION_CLASSES[position ?? 'topright'];
  const controlContainerRef = React.useRef<HTMLDivElement>(null);

  /**
   * Whenever the control container ref is created, Ensure the click / scroll
   * propagation is removed.
   *
   * This way click/scroll events do not bubble down to the map
   */
  React.useEffect(() => {
    if (controlContainerRef.current !== null) {
      L.DomEvent.disableClickPropagation(controlContainerRef.current);
      L.DomEvent.disableScrollPropagation(controlContainerRef.current);
    }
  }, [L, controlContainerRef]);

  /**
   * Whenever the position is changed, go ahead and get the container of the map
   * and the first instance of the position class in that map container
   */
  React.useEffect(() => {
    const mapContainer = map.getContainer();
    const targetDiv = mapContainer.getElementsByClassName(positionClass);
    setPortalRoot(targetDiv[0] as HTMLDivElement);
  }, [map, positionClass]);

  /**
   * Whenever the portal root is complete, append or prepend the control
   * container to the portal root
   */
  React.useEffect(() => {
    if (portalRoot != null && controlContainerRef.current != null) {
      if (prepend) {
        portalRoot.prepend(controlContainerRef.current);
      } else {
        portalRoot.append(controlContainerRef.current);
      }
    }
  }, [portalRoot, prepend, controlContainerRef]);

  return (
    <div
      ref={controlContainerRef}
      // Add leaflet-control classname
      className={cn(className, 'leaflet-control')}
    >
      {children}
    </div>
  );
};
