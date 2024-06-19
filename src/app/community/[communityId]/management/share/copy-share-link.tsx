import { useCopyToClipboard } from '@uidotdev/usehooks';
import clsx from 'clsx';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  communityId: string;
}

export const CopyShareLink: React.FC<Props> = ({ className, communityId }) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [hasCopiedText, setHasCopiedText] = React.useState(false);

  React.useEffect(() => {
    if (copiedText) {
      setHasCopiedText(true);
      setTimeout(() => {
        setHasCopiedText(false);
      }, 5000);
    }
  }, [copiedText]);

  return (
    <div className={clsx(className)}>
      <div className="flex items-center gap-2">
        <Button
          color="primary"
          endContent={<Icon icon="share" />}
          onClick={() => {
            const path = appPath('propertyList', { communityId });
            const url = `${process.env.NEXT_PUBLIC_HOSTNAME}${path}`;
            copyToClipboard(url);
          }}
        >
          Copy Share Link
        </Button>
        {hasCopiedText && <span>copied!</span>}
      </div>
      <div className="text-xs">
        The share link is only applicable to users in the access list.
      </div>
    </div>
  );
};
