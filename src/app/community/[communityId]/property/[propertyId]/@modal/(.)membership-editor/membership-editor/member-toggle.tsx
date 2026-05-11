import { cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { createSwitch, type SwitchProps } from '~/view/base/switch';
import { useHookFormContext, type InputData } from '../use-hook-form';

const Switch = createSwitch<InputData>();

interface Props {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
}

export const MemberToggle: React.FC<Props> = ({
  className,
  membershipPrefix,
}) => {
  const { watch, clearErrors } = useHookFormContext();
  const isMember = watch(`${membershipPrefix}.isMember`);

  const onChange: NonNullable<SwitchProps['onChange']> = React.useCallback(
    (evt) => {
      /**
       * This is needed because we don't need any validation when membership is
       * false
       */
      clearErrors(`${membershipPrefix}.paymentEventName`);
      clearErrors(`${membershipPrefix}.price`);
      clearErrors(`${membershipPrefix}.paymentDate`);
      clearErrors(`${membershipPrefix}.paymentMethod`);
    },
    [clearErrors, membershipPrefix]
  );

  return (
    <Switch
      className={className}
      controlName={`${membershipPrefix}.isMember`}
      aria-label="Is Member?"
      size="sm"
      color="success"
      thumbIcon={(thumbArg) => {
        if (thumbArg.isSelected) {
          return (
            <Icon
              className={cn(thumbArg.className, 'text-success')}
              icon="thumb-up"
            />
          );
        }
      }}
      onChange={onChange}
    >
      {isMember ? 'has membership' : 'non-member'}
    </Switch>
  );
};
