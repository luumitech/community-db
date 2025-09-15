'use client';
import React from 'react';
import { useLayoutContext } from './layout-context';
import { OccupantEditorModal } from './occupant-editor-modal';
import { PropertyDeleteModal } from './property-delete-modal';
import { RegisterEventModal } from './register-event-modal';
import { SendMailModal } from './send-mail-modal';

interface Props {}

export const LayoutContent: React.FC<Props> = (props) => {
  const { occupantEditor, propertyDelete, registerEvent, sendMail } =
    useLayoutContext();

  return (
    <>
      <OccupantEditorModal modalControl={occupantEditor} />
      <PropertyDeleteModal modalControl={propertyDelete} />
      <RegisterEventModal modalControl={registerEvent} />
      <SendMailModal modalControl={sendMail} />
    </>
  );
};
