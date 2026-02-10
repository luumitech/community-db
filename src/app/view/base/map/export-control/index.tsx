import { AnimatePresence, motion, type Variants } from 'motion/react';
import React from 'react';
import { useMap } from 'react-leaflet';
import { useAppContext } from '~/custom-hooks/app-context';
import { startDownloadUrl } from '~/lib/dom';
import { ToolbarControl } from '~/view/base/map';
import { toast } from '~/view/base/toastify';
import { ToolbarButton } from '../toolbar';
import { mapToPNG } from './map-to-png';
import { printHtml } from './print-html';

const item: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

type ToPNGFn = (url: string) => Promise<void>;

interface Props {
  position?: L.ControlPosition;
  /** File name to export screenshot */
  fileName?: string;
}

export const ExportControl: React.FC<Props> = ({
  position = 'topleft',
  fileName = 'map.png',
  ...props
}) => {
  const { loadingModal } = useAppContext();
  const map = useMap();
  const { setLoading } = loadingModal;
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toPNG = React.useCallback(
    async (cb: ToPNGFn) => {
      setLoading(true);
      /**
       * Start the conversion process in the next cycle, so we make sure the
       * loading modal appears
       */
      setTimeout(async () => {
        try {
          const url = await mapToPNG(map);
          await cb(url);
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          }
        } finally {
          setLoading(false);
          setIsExpanded(false);
        }
      });
    },
    [map, setLoading]
  );

  const printPNG = React.useCallback<ToPNGFn>(async (url) => {
    await printHtml(`<img src="${url}" />`);
  }, []);

  const savePNG = React.useCallback<ToPNGFn>(
    async (url) => {
      startDownloadUrl(url, fileName);
    },
    [fileName]
  );

  return (
    <ToolbarControl className="flex gap-0.5" position={position}>
      <div className="leaflet-bar">
        <ToolbarButton
          icon="mapSetting"
          title="Toggle export map menu"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="overflow-hidden"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.05,
                },
              },
            }}
          >
            <div className="flex">
              <motion.div className="leaflet-bar" variants={item}>
                <ToolbarButton
                  icon="download"
                  title="Save as image..."
                  onClick={() => toPNG(savePNG)}
                />
              </motion.div>
              <motion.div className="leaflet-bar" variants={item}>
                <ToolbarButton
                  icon="printer"
                  title="Print..."
                  onClick={() => toPNG(printPNG)}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolbarControl>
  );
};
