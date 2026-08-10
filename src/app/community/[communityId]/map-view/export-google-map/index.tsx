import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { ToolbarButton } from '~/view/base/map';
import { usePageContext } from '../page-context';
import { ExportModal, useModalControl } from './export-modal';

interface Props {
  className?: string;
}

export const ExportGoogleMap: React.FC<Props> = ({ className }) => {
  const { communityName } = useLayoutContext();
  const { community } = usePageContext();
  const modalControl = useModalControl();

  return (
    <>
      <ToolbarButton
        icon="googleMap"
        title="Export to Google Custom map"
        onClick={() =>
          modalControl.open({
            propertyList: community.rawPropertyList,
            exportFn: R.toKebabCase(`${communityName ?? ''}-google-map.csv`),
          })
        }
      />
      <ExportModal modalControl={modalControl} />
    </>
  );
};
