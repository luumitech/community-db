import React from 'react';
import { CurrentEvent } from '../current-event';
import { MembershipStatus } from '../membership-status';
import { NotesView } from '../notes-view';

interface Props {
  className?: string;
}

export const MembershipDisplay: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <div className="mb-1 grid gap-4 md:grid-cols-2">
        <MembershipStatus />
        <CurrentEvent />
        {/* Notes section always takes full row */}
        <NotesView className="col-span-full" />
      </div>
    </div>
  );
};
