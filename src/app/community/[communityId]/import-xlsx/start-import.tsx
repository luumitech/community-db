import { cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Button } from '~/view/base/button';
import { useCheckMethodRequirement } from './method-map/check-method-requirement';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const StartImport: React.FC<Props> = ({ className }) => {
  const msg = useCheckMethodRequirement();
  const formMethods = useHookFormContext();
  const { trigger, formState } = formMethods;
  const { errors } = formState;

  const mapErrMsg = errors.map?.message;

  return (
    <div className={cn(className, 'flex items-center gap-3')}>
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
        isDisabled={!!msg}
      >
        Import
      </Button>
      {mapErrMsg != null && (
        <span className="text-sm text-danger">{mapErrMsg}</span>
      )}
    </div>
  );
};
