import { cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectProps, type SelectItem } from '~/view/base/select';
import { OwnerChip } from '../owner-chip';

type CustomProps = Omit<SelectProps, 'items'>;

interface Props extends CustomProps {
  className?: string;
  community: GQL.CommunityOwner_ModifyFragment;
}

export const OwnerSelect: React.FC<Props> = ({
  className,
  community,
  ...props
}) => {
  const items: SelectItem[] = React.useMemo(() => {
    const { access, otherAccessList, owner } = community;

    return [
      {
        key: access.user.id,
        textValue: access.user.email,
        ...(owner.id === access.user.id && { description: <OwnerChip /> }),
      },
      ...otherAccessList.map((entry) => ({
        key: entry.user.id,
        textValue: entry.user.email,
        ...(owner.id === entry.user.id && { description: <OwnerChip /> }),
      })),
    ];
  }, [community]);

  return (
    <Select
      label="Owner Email"
      items={items}
      disallowEmptySelection
      placeholder="Select an owner"
      defaultSelectedKeys={[community.owner.id]}
      {...props}
    />
  );
};
