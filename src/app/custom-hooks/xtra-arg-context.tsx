import React from 'react';

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<unknown>();

interface Props {
  children: React.ReactNode;
}

/** Typed Context provider for keeping arbitrary object in React context provider */
export function XtraArgProvider<T extends object>({
  children,
  ...xtraProps
}: Props & T) {
  return <Context.Provider value={xtraProps}>{children}</Context.Provider>;
}

/** Helper hook for accessing React context */
export function useXtraArgContext<T>() {
  const context = React.useContext(Context as React.Context<Readonly<T>>);
  if (!context) {
    throw new Error(`useXtraContext must be used within a XtraProvider`);
  }
  return context;
}
