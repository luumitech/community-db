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
import { env } from '~/lib/env-cfg';
import { appTitle } from '~/lib/env-var';

interface Props {
  email: string;
  otp: string;
}

export default function OtpCode(props: Props) {
  const { email, otp } = props;
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
              'border-1 border-x-gray-200 rounded-md shadow-[0_5px_10px_rgba(20,50,70,.2)]',
              'mt-5 max-w-[360px] mx-auto',
              'py-12 px-4'
            )}
          >
            <Img
              className="mx-auto"
              src={`${env.NEXT_PUBLIC_HOSTNAME}/image/community-db-logo.png`}
              width="64"
              height="64"
              alt="Community DB Logo"
            />
            <Text className="text-3xl text-center font-extrabold">
              {appTitle}
            </Text>
            <Heading className="text-lg font-bold text-center">
              Let&apos;s get you signed in
            </Heading>
            <Text className="text-center mt-8 mb-0">
              Please use this code to login:
            </Text>
            <Section
              className={cn(
                'bg-[rgba(0,0,0,.05)]',
                'rounded-lg my-0',
                'align-middle',
                'w-[280px]'
              )}
            >
              <Text
                className={cn(
                  'text-black font-bold text-3xl',
                  'tracking-wide',
                  'py-2',
                  'my-auto',
                  'text-center'
                )}
              >
                {otp}
              </Text>
            </Section>
            <Text className="text-[10px] text-center mt-0">
              Please note this code is only valid for 5 minutes.
            </Text>

            <Text className="text-sm text-center">
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
}
