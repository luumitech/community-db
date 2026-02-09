import domtoimage from 'dom-to-image';
import React from 'react';
import { useMap } from 'react-leaflet';
import { useAppContext } from '~/custom-hooks/app-context';
import { startDownloadUrl } from '~/lib/dom';
import { Icon } from '~/view/base/icon';
import { ToolbarControl } from '~/view/base/map';
import { toast } from '~/view/base/toastify';

import './styles.css';

const SCREENSHOT_CLASS = 'export-png-taking-screenshot';

interface Props {
  position?: L.ControlPosition;
  /** File name to export screenshot */
  fileName?: string;
  /** Tooltip when hovered over button */
  tooltip?: string;
}

export const ExportPNG: React.FC<Props> = ({
  position = 'topleft',
  fileName = 'map.png',
  tooltip,
  ...props
}) => {
  const { loadingModal } = useAppContext();
  const map = useMap();
  const { setLoading } = loadingModal;

  const exportScreenshot = React.useCallback(async () => {
    setLoading(true);
    /**
     * Start the conversion process in the next cycle, so we make sure the
     * loading modal appears
     */
    setTimeout(async () => {
      try {
        const container = map.getContainer();
        container.classList.add(SCREENSHOT_CLASS);
        const href = await domtoimage.toPng(container);
        container.classList.remove(SCREENSHOT_CLASS);
        startDownloadUrl(href, fileName);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    });
  }, [fileName, map, setLoading]);

  return (
    <ToolbarControl className="leaflet-bar" position={position}>
      <a role="button" title={tooltip} onClick={exportScreenshot}>
        <div className="flex h-full w-full items-center justify-center">
          <Icon icon="download" size={20} />
        </div>
      </a>
    </ToolbarControl>
  );
};
