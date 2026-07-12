import React from 'react';
import simplur from 'simplur';
import { twMerge } from 'tailwind-merge';
import { usePageContext } from './page-context';

interface Props {
  className?: string;
}

export const MemberStat: React.FC<Props> = ({ className }) => {
  const { matchPropertyWithGps, matchPropertyCount, propertyCount } =
    usePageContext();

  const missingGps = React.useMemo(() => {
    return matchPropertyCount - matchPropertyWithGps.length;
  }, [matchPropertyWithGps, matchPropertyCount]);

  return (
    <div className={twMerge('flex flex-col', className)}>
      <span className="text-xs text-foreground/50">
        {simplur`${matchPropertyCount} of ${propertyCount} propert[y|ies] matched filter`}
      </span>
      {matchPropertyWithGps.length > 0 && missingGps > 0 && (
        <span className="text-xs text-warning">
          {simplur`(warning: ${missingGps} propert[y|ies] missing GPS location)`}
        </span>
      )}
    </div>
  );
};
