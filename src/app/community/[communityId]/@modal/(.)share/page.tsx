'use client';
import { Link } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AccessEditor } from '~/community/[communityId]/common/access-editor';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Modal } from '~/view/base/modal';
import { CopyShareLink } from './copy-share-link';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function Share(props: RouteArgs) {
  const router = useRouter();
  const params = React.use(props.params);
  const { communityId } = params;
  const { community } = useLayoutContext();

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Modal
      size="3xl"
      isOpen
      onOpenChange={goBack}
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <Modal.Content>
        {(closeModal) => (
          <>
            <Modal.Header>{`${appLabel('communityShare')} "${community.name}"`}</Modal.Header>
            <Modal.Body>
              <CopyShareLink className="mb-2" communityId={communityId} />
              <AccessEditor communityId={communityId} hideRole hideAction />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="bordered"
                as={Link}
                href={appPath('communityAccessModify', {
                  path: { communityId },
                })}
              >
                {appLabel('communityAccessModify')}
              </Button>
              <Button className="ml-auto" color="primary" onPress={closeModal}>
                Done
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
}
