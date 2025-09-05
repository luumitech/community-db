import React from 'react';
import {
  useCommunityContext,
  type CommunityState,
} from './layout-util/community-context';
import { type CommunityEntry } from './layout-util/community-query';

interface ContextT extends Readonly<CommunityState> {}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  community: CommunityEntry;
  children: React.ReactNode;
}

export function LayoutProvider({ community, children, ...props }: Props) {
  const stateValues = useCommunityContext(community);

  return (
    <Context.Provider
      value={{
        ...stateValues,
      }}
      {...props}
    >
      {children}
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
