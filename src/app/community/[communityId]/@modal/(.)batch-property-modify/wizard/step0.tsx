import { Button, cn } from '@heroui/react';
import React from 'react';
import { Modal } from '~/view/base/modal';
import { MethodSelect } from '../method-select';
import { Wizard } from './';

export interface Step0Props {}

export const Step0: React.FC<Step0Props> = () => {
  return <MethodSelect />;
};
