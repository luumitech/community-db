'use client';
import React from 'react';
import { useLayoutContext } from './layout-context';
import { PropertyDeleteModal } from './property-delete-modal';
import { RegisterEventModal } from './register-event-modal';
import { SendMailModal } from './send-mail-modal';

interface Props {}

export const LayoutContent: React.FC<Props> = (props) => {
  const { propertyDelete, registerEvent, sendMail } = useLayoutContext();

  return (
    <>
      <PropertyDeleteModal modalControl={propertyDelete} />
      <RegisterEventModal modalControl={registerEvent} />
      <SendMailModal modalControl={sendMail} />
    </>
  );
};
