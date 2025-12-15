import { HeroUIProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {}

export const HeroUIProviders: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const router = useRouter();

  return <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>;
};
