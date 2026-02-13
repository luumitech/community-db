import React from 'react';
import { twMerge } from 'tailwind-merge';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { Tooltip } from '~/view/base/tooltip';
import { type AccessEntry } from '../_type';
import { roleItems } from '../role-select';
import { RoleDescription } from './role-description';

const RoleFragment = graphql(/* GraphQL */ `
  fragment AccessList_Role on Access {
    role
  }
`);

interface Props {
  className?: string;
  fragment: AccessEntry;
}

export const RoleInfo: React.FC<Props> = ({ className, fragment }) => {
  const entry = getFragment(RoleFragment, fragment);

  const found = roleItems.find(({ key }) => entry.role === key);
  if (!found) {
    return null;
  }

  return (
    <Tooltip isFixed content={<RoleDescription role={entry.role} />}>
      <div className={twMerge('truncate', className)}>{found?.label ?? ''}</div>
    </Tooltip>
  );
};
