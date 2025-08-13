'use client';
import React from 'react';
import type { LMod } from './_type';
import {
  loadReactLeafletComponents,
  type ReactLeafletComponents,
} from './load-react-leaflet';

import 'leaflet/dist/leaflet.css';
import './styles.css';

export * from './address-search-control';
export * from './fit-bound';
export * from './geo-location-center';
export * from './leaflet-draw';
export * from './leaflet-marker';
export * from './map-center';
export * from './map-container';
export * from './map-event-listener';
export * from './print-control';
export * from './toolbar-control';

interface ContextT {
  L: LMod;
  reactLeaflet: ReactLeafletComponents;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

/**
 * Load leaflet related components dynamically to avoid SSR compile error
 *
 * This also guarantees that leaflet is loaded first, and all other dependent
 * components will have access to the leaflet global instance
 */
export function MapContextProvider(props: Props) {
  const [leaflet, setLeaflet] = React.useState<LMod>();

  React.useEffect(() => {
    (async () => {
      const mod = await import('leaflet');
      /**
       * Load other modules that extends leaflet to provide additional
       * functionalities
       */
      await import('@geoman-io/leaflet-geoman-free');
      // @ts-expect-error no typescript available for leaflet-easyprint
      await import('leaflet-easyprint');

      setLeaflet(mod.default);
    })();
  }, []);

  if (!leaflet) {
    return null;
  }

  return (
    <Context.Provider
      value={{
        L: leaflet,
        reactLeaflet: loadReactLeafletComponents(),
      }}
      {...props}
    />
  );
}

export function useMapContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useMapContext must be used within a MapContextProvider`);
  }
  return context;
}
