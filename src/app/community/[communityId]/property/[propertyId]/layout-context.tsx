import React from 'react';
import { CommunityEntry, PropertyEntry } from './_type';

type ContextT = Readonly<{
  community: CommunityEntry;
  property: PropertyEntry;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  community: CommunityEntry;
  property: PropertyEntry;
  children: React.ReactNode;
}

export function LayoutProvider({ community, property, ...props }: Props) {
  return (
    <Context.Provider
      value={{
        community,
        property,
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
