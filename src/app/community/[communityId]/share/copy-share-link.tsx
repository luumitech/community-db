import { Input } from '@heroui/react';
import React from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { useAppContext } from '~/custom-hooks/app-context';
import { appPath } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { toast } from '~/view/base/toastify';

interface Props {
  className?: string;
  communityId: string;
}

export const CopyShareLink: React.FC<Props> = ({ className, communityId }) => {
  const { env } = useAppContext();
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const url = React.useMemo(() => {
    const path = appPath('propertyList', { path: { communityId } });
    const hostname = env.NEXT_PUBLIC_HOSTNAME;
    return `${hostname}${path}`;
  }, [env, communityId]);

  return (
    <div className={className}>
      <div className="flex items-start gap-2">
        <Input
          variant="bordered"
          value={url}
          readOnly
          description="Only user in the access list can view this database"
        />
        <Button
          className="shrink-0"
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
