import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  /** Render a custom component when the table is empty */
  emptyContent?: React.ReactNode;
}

/** Default empty content */
export const EmptyContent: React.FC<Props> = ({ emptyContent }) => {
  const DefaultEmptyContent = React.useCallback(() => {
    return (
      <div className="mt-6 mb-2 flex items-center justify-center">
        <p className="font-semibold text-default-400">No data to display.</p>
      </div>
    );
  }, []);

  return (
    <div className="col-span-full">
      {emptyContent ?? <DefaultEmptyContent />}
    </div>
  );
};
