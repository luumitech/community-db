'use client';
import { useQuery } from '@apollo/client';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { appLabel } from '~/lib/app-path';
import styles from './styles.module.css';
import { FreePlan, PremiumPlan } from './view-plan';

const UserSubscriptionQuery = graphql(/* GraphQL */ `
  query userSubscription {
    userCurrent {
      id
      subscription {
        id
        status
        dateActivated
        dateBilling
      }
    }
  }
`);

export default function Pricing() {
  const router = useRouter();
  const result = useQuery(UserSubscriptionQuery, {
    fetchPolicy: 'cache-and-network',
  });
  useGraphqlErrorHandler(result);

  const plan = result.data?.userCurrent.subscription;

  return (
    <Modal
      size="xl"
      scrollBehavior="outside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable={false}
      // isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader>{appLabel('pricing')}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4 items-start p-2">
            <FreePlan className={styles['item-with-border']} plan={plan} />
            <PremiumPlan plan={plan} />
          </div>
        </ModalBody>
        <ModalFooter className="justify-center">
          Need more capabilities? Contact our team
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
