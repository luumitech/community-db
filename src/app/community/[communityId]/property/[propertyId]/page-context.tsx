import React from 'react';
import * as communityModifyModal from '~/community/[communityId]/community-modify-modal';
import { useAppContext } from '~/custom-hooks/app-context';
import { CommunityEntry, PropertyEntry } from './_type';
import * as membershipEditorModal from './membership-editor-modal';
import * as occupantEditorModal from './occupant-editor-modal';
import * as propertyDeleteModal from './property-delete-modal';
import * as propertyModifyModal from './property-modify-modal';
import * as registerEventModal from './register-event-modal';
import { useSendMailModal } from './send-mail-modal';

type ContextT = Readonly<{
  community: CommunityEntry;
  property: PropertyEntry;
  occupantEditor: occupantEditorModal.UseHookFormWithDisclosureResult;
  propertyModify: propertyModifyModal.UseHookFormWithDisclosureResult;
  membershipEditor: membershipEditorModal.UseHookFormWithDisclosureResult;
  propertyDelete: propertyDeleteModal.UseHookFormWithDisclosureResult;
  registerEvent: registerEventModal.UseHookFormWithDisclosureResult;
  communityModify: communityModifyModal.UseHookFormWithDisclosureResult;
  sendMail: ReturnType<typeof useSendMailModal>;
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
  const occupantEditor =
    occupantEditorModal.useHookFormWithDisclosure(property);
  const propertyModify =
    propertyModifyModal.useHookFormWithDisclosure(property);
  const membershipEditor = membershipEditorModal.useHookFormWithDisclosure(
    property,
    yearSelected
  );
  const propertyDelete =
    propertyDeleteModal.useHookFormWithDisclosure(property);
  const registerEvent = registerEventModal.useHookFormWithDisclosure(property);
  const communityModify =
    communityModifyModal.useHookFormWithDisclosure(community);
  const sendMail = useSendMailModal();

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
