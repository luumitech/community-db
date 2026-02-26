import { cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
}

export const HouseholdManager: React.FC<Props> = ({ className }) => {
  return <div className={cn(className)}>abc</div>;
};
