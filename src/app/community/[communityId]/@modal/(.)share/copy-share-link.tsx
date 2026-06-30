import { cn } from '@heroui/react';
import React from 'react';
import { useCopyToClipboard } from 'react-use';
import { useAppContext } from '~/custom-hooks/app-context';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { PlainInput } from '~/view/base/input';
import { toast } from '~/view/base/toastify';
import { Tooltip } from '~/view/base/tooltip';

interface Props {
  className?: string;
  communityId: string;
}

export const CopyShareLink: React.FC<Props> = ({ className, communityId }) => {
  const { env } = useAppContext();
  const [copiedState, copyToClipboard] = useCopyToClipboard();

  const url = React.useMemo(() => {
    const path = appPath('propertyList', { path: { communityId } });
    const hostname = env.NEXT_PUBLIC_HOSTNAME;
    return `${hostname}${path}`;
  }, [env, communityId]);

  React.useEffect(() => {
    const { error, value } = copiedState;
    if (error) {
      toast.error(`Unable to copy: ${error.message}`);
    }
    if (value) {
      toast.success('Link Copied');
    }
  }, [copiedState]);

  return (
    <div className={className}>
      <div className="flex items-start gap-2">
        <PlainInput
          variant="bordered"
          value={url}
          readOnly
          description="Only user in the access list can view this database"
          endContent={
            <Tooltip content="Copy Link">
              <Icon
                className={cn(
                  'cursor-pointer text-primary',
                  'opacity-disabled hover:opacity-hover'
                )}
                icon="copy"
                onClick={() => copyToClipboard(url)}
              />
            </Tooltip>
          }
        />
      </div>
    </div>
  );
};
