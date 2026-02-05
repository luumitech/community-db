import React from 'react';
import type { AudienceMember } from '../../_type';
import { ModifyMemberButton } from './modify-member';
import { OccupantEditButton } from './occupant-edit';
import { PropertyViewButton } from './property-view';

interface Props {
  className?: string;
  audienceListId?: string;
  item: AudienceMember;
}

export const Actions: React.FC<Props> = ({
  className,
  audienceListId,
  item,
}) => {
  const { property, occupant } = item;

  return (
    <div className="flex flex-nowrap">
      {audienceListId != null && (
        <ModifyMemberButton audienceListId={audienceListId} member={item} />
      )}
      {property != null && <PropertyViewButton property={property} />}
      {property != null && occupant != null && (
        <OccupantEditButton
          property={property}
          occupant={occupant}
          email={item.email_address}
        />
      )}
    </div>
  );
};
