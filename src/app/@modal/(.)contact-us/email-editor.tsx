import { Divider, Input, Textarea } from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const EmailEditor: React.FC<Props> = ({ className }) => {
  const searchParams = useSearchParams();
  const messageDescription = searchParams.get('messageDescription');
  const { register, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <>
      <Input
        className={className}
        variant="bordered"
        label="Subject"
        isRequired
        placeholder="Enter email subject"
        errorMessage={errors.subject?.message}
        isInvalid={!!errors.subject?.message}
        {...register('subject')}
      />
      <Input
        className={className}
        variant="bordered"
        label="Email"
        isRequired
        /**
         * Should use type="email"
         *
         * But nextUI is eating the default browser validation
         *
         * See: https://github.com/nextui-org/nextui/issues/1996
         */
        // type="email"
        placeholder="Your email address"
        description="We'll never share your email with anyone else."
        errorMessage={errors.contactEmail?.message}
        isInvalid={!!errors.contactEmail?.message}
        {...register('contactEmail')}
      />
      <Input
        className={className}
        variant="bordered"
        label="Name"
        placeholder="Your name"
        errorMessage={errors.contactName?.message}
        isInvalid={!!errors.contactName?.message}
        {...register('contactName')}
      />
      <Divider />
      <Textarea
        className={className}
        variant="bordered"
        label="Your Message"
        labelPlacement="outside"
        description={
          !!messageDescription && (
            <>
              {messageDescription.split('\n').map((msg, idx) => (
                <p key={idx}>{msg}</p>
              ))}
            </>
          )
        }
        isRequired
        errorMessage={errors.message?.message}
        isInvalid={!!errors.message?.message}
        {...register('message')}
      />
    </>
  );
};
