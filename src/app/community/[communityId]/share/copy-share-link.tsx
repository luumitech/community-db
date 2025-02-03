import { cn } from '@heroui/react';
import { env } from 'next-runtime-env';
import React from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { appPath } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { toast } from '~/view/base/toastify';

interface Props {
  className?: string;
  communityId: string;
}

export const CopyShareLink: React.FC<Props> = ({ className, communityId }) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  return (
    <div className={cn(className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="bordered"
          color="primary"
          endContent={<Icon icon="link" />}
          onPress={() => {
            const path = appPath('propertyList', { path: { communityId } });
            const hostname = env('NEXT_PUBLIC_HOSTNAME');
            const url = `${hostname}${path}`;

            toast.promise(copyToClipboard(url), {
              success: 'Copied',
            });
          }}
        >
          Copy Database URL
        </Button>
      </div>
    </div>
  );
};
