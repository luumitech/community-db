import { cn } from '@heroui/react';
import React from 'react';
import { MemberStatusChip } from '~/community/[communityId]/common/member-status-chip';
import { Occupant } from '~/community/[communityId]/property-list/property-table/occupant';
import * as GQL from '~/graphql/generated/graphql';
import { formatAsDate } from '~/lib/date-util';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  property: GQL.PropertyId_MembershipEditorFragment;
  /** Existing membership details, if already a member */
  membership?: GQL.PropertyId_MembershipEditorFragment['membershipList'][number];
}

export const MemberStatus: React.FC<Props> = ({
  className,
  property,
  membership,
}) => {
  const { getValues } = useHookFormContext();
  const memberYear = getValues('membership.year');
  const isMember = membership?.isMember;
  const memberEvent = membership?.eventAttendedList?.[0];

  return (
    <div className="flex flex-col gap-0.5">
      <MemberStatusChip isMember={isMember} hideText>
        {memberYear}
      </MemberStatusChip>
      <div className="text-sm text-default-600">
        {isMember && memberEvent ? (
          <div>
            These members registered at{' '}
            <span className="font-semibold">{memberEvent.eventName}</span>
            {memberEvent.eventDate != null && (
              <span>
                {' '}
                on{' '}
                <span className="font-semibold">
                  {/**
                   * Format date similar to getCurrentDate(), to be consistent with rest of the
                   * dialog
                   */}
                  {formatAsDate(
                    // eventDate is UTC date, add T00:00:00 to interpret as local
                    `${memberEvent.eventDate}T00:00:00`,
                    'MMM d, yyyy'
                  )}
                </span>
              </span>
            )}
            :
          </div>
        ) : (
          <span>
            The following individuals do not hold active membership status:
          </span>
        )}
      </div>
      <Occupant
        className="grow"
        fragment={property}
        emptyContent={<span className="text-sm text-default-600">n/a</span>}
      />
    </div>
  );
};
