'use client';
import {
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { appTitle } from '~/lib/env-var';
import { Item } from './item';

export default function Terms() {
  const router = useRouter();
  return (
    <Modal
      size="3xl"
      scrollBehavior="inside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable
      // isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader className="text-2xl">Terms of Service</ModalHeader>
        <ModalBody className="gap-6">
          <Item title="1. Acceptance of Terms">
            By accessing and using {appTitle}, you agree to comply with and be
            bound by these Terms of Service. If you do not agree to these terms,
            please do not use our services.
          </Item>
          <Item title="2. Use of the Service">
            You agree to use {appTitle} only for lawful purposes and in a manner
            that does not infringe the rights of, restrict, or inhibit anyone
            else’s use of the service.
          </Item>
          <Item title="3. Account Registration">
            To use certain features of {appTitle}, you may be required to create
            an account. You agree to provide accurate and complete information
            during the registration process and to update such information to
            keep it accurate and complete.
          </Item>
          <Item title="4. User Responsibilities">
            You are responsible for maintaining the confidentiality of your
            account information and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use
            of your account.
          </Item>
          <Item title="5. Termination">
            We reserve the right to terminate or suspend your access to
            {appTitle} at our sole discretion, without notice, for conduct that
            we believe violates these Terms or is harmful to other users or to
            {appTitle}.
          </Item>
          <Item title="6. Disclaimer of Warranties">
            {appTitle} is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis. We do not warrant that the service will be
            uninterrupted, secure, or free of errors.
          </Item>
          <Item title="7. Limitation of Liability">
            To the fullest extent permitted by law, we will not be liable for
            any direct, indirect, incidental, or consequential damages arising
            out of your use of or inability to use {appTitle}.
          </Item>
          <Item title="8. Changes to These Terms">
            We may modify these Terms of Service at any time. Your continued use
            of the service after any such changes constitutes your acceptance of
            the new Terms.
          </Item>
          <Item title="9. Governing Law">
            These Terms shall be governed by and construed in accordance with
            the laws of Ontario, Canada, and any disputes arising out of or
            related to these Terms shall be resolved in the courts located
            therein.
          </Item>
          <Item title="10. Contact Us">
            If you have any questions about these Terms, please{' '}
            <Link
              className="text-sm"
              href={appPath('contactUs', {
                query: { subject: 'Terms of Service' },
              })}
              showAnchorIcon
            >
              {appLabel('contactUs')}
            </Link>
            .
          </Item>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
