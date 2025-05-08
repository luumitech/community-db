import { Button, cn } from '@heroui/react';
import React from 'react';
import { ITEM_DELIMITER } from '~/lib/xlsx-io/delimiter-util';
import { Icon } from '~/view/base/icon';
import { toast } from '~/view/base/toastify';
import { type ContactInfo } from '../contact-util';

/**
 * Convert contact list into Mailchimp compatible CSV
 *
 * @param propertyList PropertyList obtained after filtering
 * @returns Mailchimp compatible CSV
 */
function toEmailString(contactList: ContactInfo['contactList']) {
  const emailList = contactList.map(({ email }) => email);
  return emailList.join(ITEM_DELIMITER);
}

interface Props {
  className?: string;
  contactInfo?: ContactInfo;
}

export const EmailString: React.FC<Props> = ({ className, contactInfo }) => {
  const [pending, startTransition] = React.useTransition();
  const [copied, setCopied] = React.useState(false);
  const contactList = contactInfo?.contactList ?? [];
  const contactCount = contactList.length;

  // Use local copyToClipboard implementation
  // until this is fixed:
  // https://github.com/uidotdev/usehooks/issues/312
  const copyToClipboard = React.useCallback(
    () =>
      startTransition(async () => {
        if (navigator?.clipboard?.writeText) {
          const emailString = toEmailString(contactList);
          await navigator.clipboard.writeText(emailString);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 5000);
        } else {
          toast.error('writeText not supported');
        }
      }),
    [contactList]
  );

  return (
    <Button
      className={cn(className)}
      color="primary"
      variant="bordered"
      fullWidth
      isDisabled={contactCount === 0}
      isLoading={pending}
      {...(!copied && { endContent: <Icon icon="copy" size={14} /> })}
      onPress={copyToClipboard}
    >
      {copied ? 'Copied!' : 'Copy Emails to Clipboard'}
    </Button>
  );
};
