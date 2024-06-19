import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { FlatButton } from '~/view/base/flat-button';
import { RemoveAccess } from './remove-access';

const EntryFragment = graphql(/* GraphQL */ `
  fragment AccessList_Action on Access {
    id
    user {
      email
    }
  }
`);

export type ActionFragmentType = FragmentType<typeof EntryFragment>;

interface Props {
  className?: string;
  entry: ActionFragmentType;
}

export const Action: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);

  return (
    <div className={clsx(props.className, 'flex gap-2')}>
      <FlatButton className="text-primary" icon="edit" tooltip="Modify Role" />
      <RemoveAccess access={entry} />
    </div>
  );
};
