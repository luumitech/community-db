import React from 'react';
import { CommunityEntry } from './_type';

type ContextT = Readonly<{
  community: CommunityEntry;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  community: CommunityEntry;
  children: React.ReactNode;
}

export function PageProvider({ community, ...props }: Props) {
  return (
    <Context.Provider
      value={{
        community,
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
