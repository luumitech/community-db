import dynamic from 'next/dynamic';

export type ReactLeafletComponents = ReturnType<
  typeof loadReactLeafletComponents
>;

export function loadReactLeafletComponents() {
  const Popup = dynamic(
    async () => {
      const mod = await import('react-leaflet');
      return mod.Popup;
    },
    { ssr: false }
  );

  return { Popup };
}
