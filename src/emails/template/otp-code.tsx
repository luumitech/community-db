'server only';
import { cn } from '@heroui/react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { appTitle } from '~/lib/env';
import { env } from '~/lib/env/server-env';

/**
 * NOTE: This code is intended for react-email to render email content on server
 * side.
 *
 * As such, it should only be rendered on server only, and it is ok to reference
 * server-env directly
 */

interface Props {
  email: string;
  otp: string;
}

export const OtpCode: React.FC<Props> = ({ email, otp }) => {
  return (
    <Tailwind>
      <Html>
        <Head>
          <title>{`${appTitle} OTP`}</title>
        </Head>
        <Body className="bg-white font-sans">
          <Container
            className={cn(
              'bg-foreground',
              'rounded-md border-1 border-x-gray-200 shadow-[0_5px_10px_rgba(20,50,70,.2)]',
              'mx-auto mt-5 max-w-[360px]',
              'px-4 py-12'
            )}
          >
            <Img
              className="mx-auto"
              src={`${env('NEXT_PUBLIC_HOSTNAME')}/image/community-db-logo.png`}
              width="64"
              height="64"
              alt="Community DB Logo"
            />
            <Text className="text-center text-3xl font-extrabold">
              {appTitle}
            </Text>
            <Heading className="text-center text-lg font-bold">
              Let&apos;s get you signed in
            </Heading>
            <Text className="mt-8 mb-0 text-center">
              Please use this code to login:
            </Text>
            <Section
              className={cn(
                'bg-[rgba(0,0,0,.05)]',
                'my-0 rounded-lg',
                'align-middle',
                'w-[280px]'
              )}
            >
              <Text
                className={cn(
                  'text-3xl font-bold text-black',
                  'tracking-wide',
                  'py-2',
                  'my-auto',
                  'text-center'
                )}
              >
                {otp}
              </Text>
            </Section>
            <Text className="mt-0 text-center text-[10px]">
              Please note this code is only valid for 5 minutes.
            </Text>

            <Text className="text-center text-sm">
              Not expecting this email? You can safely ignore this email.
            </Text>

            <Section className="mt-16 text-center">
              <Text className="my-0">All the Best,</Text>
              <Text className="my-0">
                The <span className="font-extrabold">{appTitle}</span> team
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
