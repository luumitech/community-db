import React from 'react';
import { CommunityEntry, PropertyEntry } from './_type';
import * as occupantEditorModal from './occupant-editor-modal';
import * as propertyDeleteModal from './property-delete-modal';
import * as propertyModifyModal from './property-modify-modal';
import * as registerEventModal from './register-event-modal';
import * as sendMailModal from './send-mail-modal';

type ContextT = Readonly<{
  community: CommunityEntry;
  property: PropertyEntry;
  occupantEditor: occupantEditorModal.ModalControl;
  propertyModify: propertyModifyModal.ModalControl;
  propertyDelete: propertyDeleteModal.ModalControl;
  registerEvent: registerEventModal.ModalControl;
  sendMail: sendMailModal.ModalControl;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  community: CommunityEntry;
  property: PropertyEntry;
  children: React.ReactNode;
}

export function LayoutProvider({ community, property, ...props }: Props) {
  const occupantEditor = occupantEditorModal.useModalControl();
  const propertyModify = propertyModifyModal.useModalControl();
  const propertyDelete = propertyDeleteModal.useModalControl();
  const registerEvent = registerEventModal.useModalControl();
  const sendMail = sendMailModal.useModalControl();

  return (
    <Context.Provider
      value={{
        community,
        property,
        occupantEditor,
        propertyModify,
        propertyDelete,
        registerEvent,
        sendMail,
      }}
      {...props}
    />
  );
}

export function useLayoutContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useLayoutContext must be used within a LayoutProvider`);
  }
  return context;
}
