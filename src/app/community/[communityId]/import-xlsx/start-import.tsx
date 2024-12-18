import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Button } from '~/view/base/button';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const StartImport: React.FC<Props> = ({ className }) => {
  const formMethods = useHookFormContext();
  const { trigger } = formMethods;

  return (
    <div className={clsx(className)}>
      <Button
        color="primary"
        type="submit"
        confirmation={true}
        beforeConfirm={async () => {
          const validated = await trigger();
          return validated;
        }}
        confirmationArg={{
          bodyText: (
            <p>
              Importing will wipe existing entries in current database.
              <br />
              Proceed?
            </p>
          ),
        }}
      >
        Import
      </Button>
    </div>
  );
};
