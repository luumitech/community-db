import { cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
}

export const FootNote: React.FC<Props> = ({ className }) => {
  const renderTerm = React.useCallback((term: string, definition: string) => {
    return (
      <>
        <dt className="font-semibold">{term}</dt>
        <dd className="text-default-500">{definition}</dd>
      </>
    );
  }, []);

  return (
    <dl className={cn('grid grid-cols-[auto_1fr] gap-x-4 gap-y-1', 'text-sm')}>
      {renderTerm('new', 'Member without a membership in the previous year.')}
      {renderTerm(
        'renewed',
        'Member with an active membership in the previous year.'
      )}
      {renderTerm(
        'no renewal',
        'Individual who was a member in the previous year but did not renew.'
      )}
    </dl>
  );
};
