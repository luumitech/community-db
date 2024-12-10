import clsx from 'clsx';
import React from 'react';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { EventDatePicker } from './event-date-picker';
import { EventNameSelect } from './event-name-select';
import { PaymentInfoEditor } from './payment-info-editor';
import { TicketInput } from './ticket-input';
import { useHookFormContext, type InputData } from './use-hook-form';

interface Props {
  className?: string;
  /** Callback when register is clicked */
  onRegister: (input: InputData) => Promise<void>;
}

export const EventEditor: React.FC<Props> = ({ className, onRegister }) => {
  const { formState, watch, handleSubmit } = useHookFormContext();
  const [pending, startTransition] = React.useTransition();
  const { isDirty } = formState;
  const canRegister = watch('canRegister');

  const onSubmit = React.useCallback(
    async (input: InputData) =>
      startTransition(async () => {
        try {
          await onRegister(input);
        } catch (err) {
          // error handled by parent
        }
      }),
    [onRegister]
  );

  const canSave = React.useMemo(() => {
    if (canRegister) {
      return true;
    }
    return isDirty;
  }, [isDirty, canRegister]);

  return (
    <div className={clsx(className)}>
      <Form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <span className="text-foreground-500 text-xs">
          Register current event
        </span>
        <div className="flex gap-2">
          <EventNameSelect />
          <EventDatePicker />
          <TicketInput />
        </div>
        <div className="flex gap-2 items-center">
          <PaymentInfoEditor className="max-w-sm" />
          <Button
            type="submit"
            color="primary"
            isLoading={pending}
            isDisabled={!canSave}
          >
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
};
