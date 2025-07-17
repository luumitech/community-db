import { cn } from '@heroui/react';
import L from 'leaflet';
import 'leaflet-easyprint';
import React from 'react';
import { useMap } from 'react-leaflet';

/**
 * React wrapper for leaflet-easyprint
 *
 * See: https://github.com/rowanwins/leaflet-easyPrint
 */

interface Props {
  /**
   * Sets the text which appears as the tooltip of the print/export button
   *
   * Default: 'Print map'
   */
  title?: string;
  /**
   * Positions the print button
   *
   * Default: 'topleft
   */
  position?: L.ControlPosition;
  /**
   * Options available include Current, A4Portrait, A4Landscape or a custom size
   * object
   *
   * Default: 'Current'
   */
  sizeModes?: ('Current' | 'A4Portrait' | 'A4Landscape')[];
  /**
   * Button tooltips for the default page sizes
   *
   * Default:
   *
   * ```ts
   * {
   *   "Current": "Current Size",
   *   "A4Landscape": "A4 Landscape",
   *   "A4Portrait": "A4 Portrait"
   * }
   * ```
   */
  defaultSizeTitles?: Record<string, string>;
  /**
   * If set to true the map is exported to a png file
   *
   * Default: false
   */
  exportOnly?: boolean;
  /**
   * A tile layer that you can wait for to draw (helpful when resizing)
   *
   * Default: null
   */
  tileLayer?: L.TileLayer;
  /**
   * A tile layer that you can wait for to draw (helpful when resizing)
   *
   * Default: 500
   */
  tileWait?: number;
  /**
   * Name of the file if export only option set to true
   *
   * Default: 'map'
   */
  filename?: string;
  /**
   * Set to true if you don't want to display the toolbar. Instead you can
   * create your own buttons or fire print events programmatically. You still
   * need to call addTo(map) to set the leaflet map context.
   *
   * Default: false
   */
  hidden?: boolean;
  /**
   * Hides the leaflet controls like the zoom buttons and the attribution on the
   * print out.
   *
   * Default: true
   */
  hideControlContainer?: boolean;
  /**
   * Hides classes on the print out. Use an array of strings as follow :
   * ['div1', 'div2']
   *
   * Default: true
   */
  hideClasses?: string[];
  /**
   * A title for the print window which will get added the printed paper.
   *
   * Defaults to title of map window.
   */
  customWindowTitle?: string;
  /**
   * A valid css colour for the spinner background color.
   *
   * Default: '#0DC5C1'
   */
  spinnerBgColor?: string;
  /**
   * A class for a custom css spinner to use while waiting for the print.
   *
   * Default: 'epLoader'
   */
  customSpinnerClass?: string;
}

export const PrintControl: React.FC<Props> = (props) => {
  const map = useMap();

  React.useEffect(() => {
    // @ts-expect-error easyPrint does not provide a typescript definition
    const control = L.easyPrint(props);
    map.addControl(control);
    return () => {
      map.removeControl(control);
    };
  }, [map, props]);

  return null;
};
