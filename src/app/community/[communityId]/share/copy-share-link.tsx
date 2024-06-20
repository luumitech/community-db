import { useCopyToClipboard } from '@uidotdev/usehooks';
import clsx from 'clsx';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { toast } from '~/view/base/toastify';

interface Props {
  className?: string;
  communityId: string;
}

export const CopyShareLink: React.FC<Props> = ({ className, communityId }) => {
  // const [copiedText, copyToClipboard] = useCopyToClipboard();

  // Use local copyToClipboard implementation
  // until this is fixed:
  // https://github.com/uidotdev/usehooks/issues/312
  const copyToClipboard = React.useCallback((value: string) => {
    const handleCopy = async () => {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        throw new Error('writeText not supported');
      }
    };

    return handleCopy();
  }, []);

  return (
    <div className={clsx(className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="bordered"
          endContent={<Icon icon="link" />}
          onClick={() => {
            const path = appPath('propertyList', { communityId });
            const url = `${process.env.NEXT_PUBLIC_HOSTNAME}${path}`;

            toast.promise(copyToClipboard(url), {
              success: 'Copied',
            });
          }}
        >
          Copy Link
        </Button>
      </div>
    </div>
  );
};
