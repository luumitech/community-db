import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '~/view/base/button';
import { useCheckMethodRequirement } from './method-map/check-method-requirement';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  isDisabled?: boolean;
}

export const StartImport: React.FC<Props> = ({ className, isDisabled }) => {
  const msg = useCheckMethodRequirement();
  const formMethods = useHookFormContext();
  const { trigger, formState } = formMethods;
  const { errors } = formState;

  const mapErrMsg = errors.map?.message;

  return (
    <div className={twMerge('flex items-center gap-3', className)}>
      <Button
        color="primary"
        type="submit"
        confirmation
        beforeConfirm={async () => {
          const validated = await trigger();
          return validated;
        }}
        confirmationArg={{
          body: (
            <p>
              Importing will wipe existing entries in current database.
              <br />
              Proceed?
            </p>
          ),
        }}
        isDisabled={!!isDisabled || !!msg}
      >
        Import
      </Button>
      {mapErrMsg != null && (
        <span className="text-sm text-danger">{mapErrMsg}</span>
      )}
    </div>
  );
};
