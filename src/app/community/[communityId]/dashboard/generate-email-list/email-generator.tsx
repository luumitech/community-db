import { Chip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';

interface Props {
  className?: string;
  listGenerator: () => Promise<Pick<GQL.Property, 'occupantList'>[]>;
  description?: React.ReactNode;
}

export const EmailGenerator: React.FC<Props> = ({
  className,
  listGenerator,
  description,
}) => {
  const [propertyCount, setPropertyCount] = React.useState<number>();
  const [emailCount, setEmailCount] = React.useState<number>();

  React.useEffect(() => {
    setPropertyCount(undefined);
    setEmailCount(undefined);
  }, [listGenerator]);

  // Use local copyToClipboard implementation
  // until this is fixed:
  // https://github.com/uidotdev/usehooks/issues/312
  const copyToClipboard = React.useCallback(() => {
    const handleCopy = async () => {
      if (navigator?.clipboard?.writeText) {
        const propertyList = await listGenerator();
        const emailList = propertyList
          .flatMap(({ occupantList }) => occupantList.map(({ email }) => email))
          .filter((email): email is string => email != null);
        setPropertyCount(propertyList.length);
        setEmailCount(emailList.length);
        await navigator.clipboard.writeText(emailList.join(';'));
      } else {
        throw new Error('writeText not supported');
      }
    };

    return handleCopy();
  }, [listGenerator]);

  return (
    <div
      className={clsx(className)}
      onClick={() => {
        toast.promise(copyToClipboard(), {
          pending: 'Obtaining Email list...',
          success: 'Copied',
        });
      }}
    >
      <div className="font-bold">Copy Email</div>
      <div className="text-foreground-500">{description}</div>
      {propertyCount != null && emailCount != null && (
        <div className="text-xs text-foreground-400">
          {propertyCount} properties, {emailCount} emails
        </div>
      )}
    </div>
  );
};
