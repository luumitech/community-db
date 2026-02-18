import { useRouter } from 'next/navigation';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '~/view/base/modal';
import { useLayoutContext } from '../../layout-context';
import { useHookForm } from './use-hook-form';

interface Props {
  onDelete: (
    community: GQL.CommunityId_CommunityDeleteModalFragment
  ) => Promise<void>;
}

export const DeleteModal: React.FC<Props> = ({ onDelete }) => {
  const router = useRouter();
  const { community: fragment } = useLayoutContext();
  const [pending, startTransition] = React.useTransition();
  const { community } = useHookForm(fragment);

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = React.useCallback(
    async () =>
      startTransition(async () => {
        try {
          await onDelete(community);
          goBack();
        } catch (err) {
          // error handled by parent
        }
      }),
    [onDelete, community, goBack]
  );

  return (
    <Modal
      size="5xl"
      isOpen
      onOpenChange={goBack}
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader>{appLabel('communityDelete')}</ModalHeader>
            <ModalBody>
              <div>
                This will delete community &apos;{community.name}&apos; and all
                data within it.
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={closeModal}>
                Cancel
              </Button>
              <Button
                color="danger"
                confirmation
                confirmationArg={{ body: 'Are you sure?' }}
                isLoading={pending}
                onPress={onSubmit}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
