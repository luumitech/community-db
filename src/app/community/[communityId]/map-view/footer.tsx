import { cn } from '@heroui/react';
import React from 'react';
import { ToolbarControl } from '~/view/base/map';
import { MarkerIcon } from './property-marker';

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  return (
    <ToolbarControl className="mr-2.5 bg-background p-1" position="bottomleft">
      <p className="text-xs text-default-600">
        Click on any property within the boundary to see more information.
        Properties with
        <MarkerIcon className="mx-0.5 inline-flex" isMember size={12} />
        indicate members.
      </p>
    </ToolbarControl>
  );
};
