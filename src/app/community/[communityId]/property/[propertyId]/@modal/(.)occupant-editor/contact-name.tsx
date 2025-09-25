import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { Icon } from '~/view/base/icon';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  controlNamePrefix: `occupantList.${number}`;
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
      className={cn(
        'flex items-center gap-2',
        'justify-between',
        { 'text-danger-300 group-data-[selected=true]:text-danger': hasError },
        className
      )}
    >
      <div
        className={cn({
          italic: !name,
        })}
      >
        {name || 'No Name'}
      </div>
      {hasError && <Icon color="" icon="warning" />}
    </div>
  );
};
