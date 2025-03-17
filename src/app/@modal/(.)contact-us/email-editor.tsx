import { Divider } from '@heroui/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { Input } from '~/view/base/input';
import { Textarea } from '~/view/base/textarea';

interface Props {
  className?: string;
}

export const EmailEditor: React.FC<Props> = ({ className }) => {
  const searchParams = useSearchParams();
  const messageDescription = searchParams.get('messageDescription');

  return (
    <>
      <Input
        className={className}
        controlName="subject"
        variant="bordered"
        label="Subject"
        isRequired
      />
      <Input
        className={className}
        controlName="contactEmail"
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
        description="We'll never share your email with anyone else."
      />
      <Input
        className={className}
        controlName="contactName"
        variant="bordered"
        label="Your Name"
      />
      <Divider />
      <Textarea
        className={className}
        controlName="message"
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
      />
    </>
  );
};
