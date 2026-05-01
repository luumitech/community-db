import { Link, cn } from '@heroui/react';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Card } from '~/view/base/card';

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
      className={cn(
        // Override default hover opacity on Link component
        'hover:opacity-100!',
        'data-[hover=true]:scale-105',
        'data-[pressed=true]:scale-110'
      )}
      as={Link}
      href={href}
      shadow="none"
      isHoverable
    >
      <Card.Header className="justify-center font-semibold">
        {label}
      </Card.Header>
      <Card.Body className="text-center text-sm text-foreground/70">
        {children}
      </Card.Body>
    </Card>
  );
};

interface Props {
  className?: string;
}

export const QuickStart: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', className)}>
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
