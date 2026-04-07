import React from 'react';

interface ContextT {
  headerNode: HTMLDivElement;
  footerNode: HTMLDivElement;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  headerNode: HTMLDivElement;
  footerNode: HTMLDivElement;
}

export function GridStackWrapperProvider({
  headerNode,
  footerNode,
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <Context.Provider
      value={{
        headerNode,
        footerNode,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useGridStackWrapperContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(
      'useGridStackWrapperContext must be used within a GridStackWrapperProvider'
    );
  }
  return context;
}
