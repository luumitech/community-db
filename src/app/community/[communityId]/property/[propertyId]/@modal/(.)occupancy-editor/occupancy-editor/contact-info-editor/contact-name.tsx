import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { useHookFormContext } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/use-hook-form';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  controlNamePrefix: `occupancyInfoList.${number}.occupantList.${number}`;
}

export const ContactName: React.FC<Props> = ({
  className,
  controlNamePrefix,
}) => {
  const { watch, formState } = useHookFormContext();
  const { errors } = formState;
  const occupant = watch(controlNamePrefix);

  const errObj = R.pathOr(
    errors,
    // @ts-expect-error unable to resolve type error
    R.stringToPath(controlNamePrefix),
    {}
  );

  const hasError = !R.isEmpty(errObj);

  const { firstName, lastName } = occupant;
  const name = `${firstName} ${lastName}`.trim();

  return (
    <div
      className={twMerge(
        'flex items-center gap-2',
        'justify-between',
        cn({
          'text-danger-300 group-data-[selected=true]:text-danger': hasError,
        }),
        className
      )}
    >
      <div
        className={cn('truncate', {
          italic: !name,
        })}
      >
        {name || 'No Name'}
      </div>
      {hasError && <Icon className="flex-none" icon="warning" />}
    </div>
  );
};
