import { Chip, Tooltip, type ChipProps } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import { Ellipsis, Truncate, type TruncateProps } from '~/view/base/truncate';

type RenderEllipsis = Required<TruncateProps>['renderEllipsis'];

const OccupantFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Occupant on Property {
    occupantList {
      firstName
      lastName
    }
  }
`);
type OccupantFragmentType = FragmentType<typeof OccupantFragment>;

interface Props extends ChipProps {
  className?: string;
  fragment: OccupantFragmentType;
}

export const Occupant: React.FC<Props> = ({
  className,
  fragment,
  ...props
}) => {
  const entry = getFragment(OccupantFragment, fragment);
  const nameList = entry.occupantList
    .map(({ firstName, lastName }) => {
      const name = `${firstName ?? ''} ${lastName ?? ''}`;
      return name.trim();
    })
    .filter((name) => !R.isEmpty(name));

  const renderEllipsis = React.useCallback<RenderEllipsis>((invisible) => {
    return (
      <Tooltip
        content={
          <div className="flex flex-wrap items-center gap-2">{invisible}</div>
        }
        placement="bottom"
      >
        <span>
          <Ellipsis />
        </span>
      </Tooltip>
    );
  }, []);

  if (nameList.length === 0) {
    return null;
  }

  return (
    <Truncate
      className={twMerge('flex items-center gap-2', className)}
      renderEllipsis={renderEllipsis}
      role="list"
    >
      {nameList.map((name, idx) => (
        <Chip key={idx} size="sm" role="listitem" {...props}>
          {name}
        </Chip>
      ))}
    </Truncate>
  );
};
