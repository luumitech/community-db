import { cn, Input } from '@heroui/react';
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

  const url = React.useMemo(() => {
    const path = appPath('propertyList', { path: { communityId } });
    const hostname = env('NEXT_PUBLIC_HOSTNAME');
    return `${hostname}${path}`;
  }, [communityId]);

  return (
    <div className={cn(className)}>
      <div className="flex items-start gap-2">
        <Input
          variant="bordered"
          value={url}
          readOnly
          description="Only user in the access list can view this database"
        />
        <Button
          className="flex-shrink-0"
          variant="bordered"
          color="primary"
          endContent={<Icon icon="link" size={20} />}
          onPress={() => {
            toast.promise(copyToClipboard(url), { success: 'Copied' });
          }}
        >
          Copy Link
        </Button>
      </div>
    </div>
  );
};
