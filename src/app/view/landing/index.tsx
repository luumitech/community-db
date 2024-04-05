'use client';
import { Button, ButtonGroup } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import React from 'react';
import { Header } from '~/view/header';
import styles from './index.module.css';

interface Props {}

export const Landing: React.FC<Props> = ({}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <div>content start</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content</div>
        <div>content end</div>
      </main>
    </div>
  );
};
