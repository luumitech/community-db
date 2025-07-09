import React from 'react';
import * as batchPropertyModifyModal from '~/community/[communityId]/batch-property-modify-modal';
import * as communityModifyModal from '~/community/[communityId]/community-modify-modal';
import * as propertyCreateModal from '~/community/[communityId]/property-create-modal';
import {
  useCommunityContext,
  type CommunityState,
} from './layout-util/community-context';
import { type CommunityEntry } from './layout-util/community-query';

interface ContextT extends Readonly<CommunityState> {
  readonly communityModify: communityModifyModal.ModalControl;
  readonly batchPropertyModify: batchPropertyModifyModal.ModalControl;
  readonly propertyCreate: propertyCreateModal.ModalControl;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  community: CommunityEntry;
  children: React.ReactNode;
}

export function LayoutProvider({ community, children, ...props }: Props) {
  const stateValues = useCommunityContext(community);
  const communityModify = communityModifyModal.useModalControl();
  const batchPropertyModify = batchPropertyModifyModal.useModalControl();
  const propertyCreate = propertyCreateModal.useModalControl();

  return (
    <Context.Provider
      value={{
        ...stateValues,
        communityModify,
        batchPropertyModify,
        propertyCreate,
      }}
      {...props}
    >
      {children}
      <communityModifyModal.CommunityModifyModal
        modalControl={communityModify}
      />
      <batchPropertyModifyModal.BatchPropertyModifyModal
        modalControl={batchPropertyModify}
      />
      <propertyCreateModal.PropertyCreateModal modalControl={propertyCreate} />
    </Context.Provider>
  );
}

export function useLayoutContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useLayoutContext must be used within a LayoutProvider`);
  }
  return context;
}

/**
 * A special context reader for header, because we want to be able to access
 * context even if we are outside the context provider
 *
 * @returns
 */
export function useLayoutContextForHeader(): Partial<ContextT> {
  const context = React.useContext(Context);
  return context ?? {};
}
