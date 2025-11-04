import { type InputProps } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import * as GQL from '~/graphql/generated/graphql';
import { DragHandle } from '~/view/base/drag-reorder';
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

        case GQL.ContactInfoType.Other:
        default:
          return <Input aria-label="value" placeholder="value" {...props} />;
      }
    },
    [type]
  );

  return (
    <div
      className={twMerge(
        'grid grid-cols-[15px_1fr_15px]',
        'sm:grid-cols-[15px_1fr_1fr_3fr_15px]',
        'items-center gap-2',
        className
      )}
      role="rowgroup"
    >
      <DragHandle className="col-start-1" />
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
      <FlatButton
        className="col-start-3 text-danger sm:col-start-auto"
        icon="cross"
        tooltip="Remove"
        onClick={onRemove}
      />
    </div>
  );
};
