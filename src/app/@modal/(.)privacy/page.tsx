'use client';
import {
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { appTitle } from '~/lib/env-var';
import { Item } from './item';

export default function Privacy() {
  const router = useRouter();
  return (
    <Modal
      size="3xl"
      placement="top-center"
      scrollBehavior="inside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable
      // isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader className="text-2xl">Privacy Policy</ModalHeader>
        <ModalBody className="gap-6">
          <Item title="1. Introduction">
            Welcome to {appTitle}. We are committed to protecting your personal
            information and your right to privacy. This Privacy Policy outlines
            what information we collect, how we use it, and your rights
            regarding that information.
          </Item>
          <Item title="2. Information We Collect">
            {appTitle} uses Google authentication to collect the following
            information:
            <ul className="list-disc pl-6">
              <li>OpenID information</li>
              <li>Email address</li>
              <li>Profile information</li>
            </ul>
            We do not collect any additional personal information from you.
          </Item>
          <Item title="3. How We Use Your Information">
            The information we collect is used solely for the purpose of
            authenticating users and providing access to our services. We do not
            use your information for any promotional purposes.
          </Item>
          <Item title="4. Cookies">
            {appTitle} uses cookies solely for authentication. We do not use any
            tracking cookies or store any additional data through cookies.
          </Item>
          <Item title="5. Sharing Your Information">
            We do not sell or share your personal information with any third
            parties. Your information is kept confidential and used only for
            authentication purposes.
          </Item>
          <Item title="6. Data Security">
            We implement reasonable security measures to protect your personal
            information from unauthorized access, loss, or misuse. However,
            please be aware that no system can be completely secure.
          </Item>
          <Item title="7. Your Rights">
            Depending on your location, you may have rights regarding your
            personal data, including the right to access and request deletion of
            your personal data. Please contact us if you wish to exercise these
            rights.
          </Item>
          <Item title="8. Third-Party Links">
            {appTitle} may contain links to third-party websites. We are not
            responsible for the privacy practices or content of these websites.
          </Item>
          <Item title="9. Changes to This Privacy Policy">
            We may update this Privacy Policy from time to time.
          </Item>
          <Item title="10. Contact Us">
            If you have any questions about this Privacy Policy, please{' '}
            <Link
              className="text-sm"
              href={appPath('contactUs', {
                query: { subject: 'Privay Policy' },
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
