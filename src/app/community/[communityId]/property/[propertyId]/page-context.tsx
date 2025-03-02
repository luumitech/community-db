import React from 'react';
import * as communityModifyModal from '~/community/[communityId]/community-modify-modal';
import { useAppContext } from '~/custom-hooks/app-context';
import { useModalArg } from '~/custom-hooks/modal-arg';
import { CommunityEntry, PropertyEntry } from './_type';
import * as membershipEditorModal from './membership-editor-modal';
import * as occupantEditorModal from './occupant-editor-modal/modal-dialog';
import * as propertyDeleteModal from './property-delete-modal';
import * as propertyModifyModal from './property-modify-modal/modify-modal';
import * as registerEventModal from './register-event-modal/modal-dialog';
import * as sendMailModal from './send-mail-modal/modal-dialog';

type ContextT = Readonly<{
  community: CommunityEntry;
  property: PropertyEntry;
  occupantEditor: ReturnType<typeof useModalArg<occupantEditorModal.ModalArg>>;
  propertyModify: ReturnType<typeof useModalArg<propertyModifyModal.ModalArg>>;
  membershipEditor: membershipEditorModal.UseHookFormWithDisclosureResult;
  propertyDelete: propertyDeleteModal.UseHookFormWithDisclosureResult;
  registerEvent: ReturnType<typeof useModalArg<registerEventModal.ModalArg>>;
  communityModify: communityModifyModal.UseHookFormWithDisclosureResult;
  sendMail: ReturnType<typeof useModalArg<sendMailModal.ModalArg>>;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  community: CommunityEntry;
  property: PropertyEntry;
  children: React.ReactNode;
}

export function PageProvider({ community, property, ...props }: Props) {
  const { communityUi } = useAppContext();
  const { yearSelected } = communityUi;
  const occupantEditor = useModalArg<occupantEditorModal.ModalArg>();
  const propertyModify = useModalArg<propertyModifyModal.ModalArg>();
  const membershipEditor = membershipEditorModal.useHookFormWithDisclosure(
    property,
    yearSelected
  );
  const propertyDelete =
    propertyDeleteModal.useHookFormWithDisclosure(property);
  const registerEvent = useModalArg<registerEventModal.ModalArg>();
  const communityModify =
    communityModifyModal.useHookFormWithDisclosure(community);
  const sendMail = useModalArg<sendMailModal.ModalArg>();

  return (
    <Context.Provider
      value={{
        community,
        property,
        occupantEditor,
        propertyModify,
        membershipEditor,
        propertyDelete,
        registerEvent,
        communityModify,
        sendMail,
      }}
      {...props}
    />
  );
}

export function usePageContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`usePageContext must be used within a PageProvider`);
  }
  return context;
}
