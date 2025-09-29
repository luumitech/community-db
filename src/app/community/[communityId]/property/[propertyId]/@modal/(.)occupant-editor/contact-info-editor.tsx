import { cn, type InputProps } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { FlatButton } from '~/view/base/flat-button';
import { Input } from '~/view/base/input';
import { PhoneInput } from '~/view/base/phone-input';
import { ContactTypeSelect } from './contact-type-select';
import { useHookFormContext } from './use-hook-form';

interface ValueInputProps {
  className?: string;
  controlName: `occupantList.${number}.infoList.${number}.value`;
  label?: string;
  ['aria-label']?: string;
  variant?: InputProps['variant'];
}

interface Props {
  className?: string;
  controlNamePrefix: `occupantList.${number}.infoList.${number}`;
  onRemove: () => void;
}

export const ContactInfoEditor: React.FC<Props> = ({
  className,
  controlNamePrefix,
  onRemove,
}) => {
  const { watch } = useHookFormContext();
  const type = watch(`${controlNamePrefix}.type`);

  const ValueInput = React.useCallback(
    (props: ValueInputProps) => {
      switch (type) {
        case GQL.ContactInfoType.Phone:
          return <PhoneInput aria-label="phone number" {...props} />;

        case GQL.ContactInfoType.Email:
          return <Input aria-label="email" placeholder="email" {...props} />;

        case GQL.ContactInfoType.Text:
        default:
          return <Input aria-label="value" placeholder="value" {...props} />;
      }
    },
    [type]
  );

  return (
    <div
      className={cn(
        'grid grid-cols-[15px_1fr]',
        'sm:grid-cols-[15px_1fr_1fr_3fr]',
        'items-center gap-2',
        className
      )}
      role="rowgroup"
    >
      <FlatButton
        className="col-start-1 text-warning"
        icon="minus"
        onClick={onRemove}
      />
      <ContactTypeSelect
        className="col-start-2 sm:col-start-auto"
        controlName={`${controlNamePrefix}.type`}
        aria-label="type"
        variant="underlined"
        placeholder="Select type"
      />
      <Input
        className="col-start-2 sm:col-start-auto"
        controlName={`${controlNamePrefix}.label`}
        aria-label="label"
        variant="underlined"
        placeholder={
          type === GQL.ContactInfoType.Email ||
          type === GQL.ContactInfoType.Phone
            ? 'eg: work,home'
            : 'eg: homepage'
        }
      />
      <ValueInput
        className="col-start-2 sm:col-start-auto"
        controlName={`${controlNamePrefix}.value`}
        aria-label="phone number"
        variant="underlined"
      />
    </div>
  );
};
