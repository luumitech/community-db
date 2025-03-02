import React from 'react';
import { useHookForm } from './use-hook-form';

type XtraProps = Omit<ReturnType<typeof useHookForm>, 'formMethods'>;

type ContextT = Readonly<XtraProps>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props extends XtraProps {
  children: React.ReactNode;
}

export function XtraProvider({ children, ...xtraProps }: Props) {
  return <Context.Provider value={xtraProps}>{children}</Context.Provider>;
}

export function useXtraContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useXtraContext must be used within a XtraProvider`);
  }
  return context;
}
