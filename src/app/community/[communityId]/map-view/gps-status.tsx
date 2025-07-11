import { useMutation } from '@apollo/client';
import { cn } from '@heroui/react';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from './page-context';

interface Props {
  className?: string;
}

export const GpsStatus: React.FC<Props> = ({ className }) => {
  const { community } = usePageContext();

  return (
    <div className={cn(className)}>
      show How many GPS coordinate missing
      {/* <button onClick={() => completeGps()}>Get GPS coord</button> */}
    </div>
  );
};
