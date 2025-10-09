import { Card, CardBody, CardHeader, Link, cn } from '@heroui/react';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';

interface CustomButtonProps {
  label: string;
  href: string;
}

const CustomButton: React.FC<React.PropsWithChildren<CustomButtonProps>> = ({
  label,
  href,
  children,
}) => {
  return (
    <Card
      className="border dark:border-gray-600"
      as={Link}
      href={href}
      shadow="none"
      isHoverable
    >
      <CardHeader className="justify-center font-semibold">{label}</CardHeader>
      <CardBody className="text-center text-sm text-default-500">
        {children}
      </CardBody>
    </Card>
  );
};

interface Props {
  className?: string;
}

export const QuickStart: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-4', className)}>
      <CustomButton
        label={appLabel('communitySelect')}
        href={appPath('communitySelect')}
      >
        Manage an existing community.
      </CustomButton>
      <CustomButton
        label={appLabel('communityCreate')}
        href={appPath('communityCreate')}
      >
        Build your own community with tools to engage, grow, and moderate.
      </CustomButton>
    </div>
  );
};
