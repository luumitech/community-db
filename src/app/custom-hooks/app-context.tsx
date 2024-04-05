import React from 'react';

type State = Readonly<{}>;

interface ContextT extends State {}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

export function AppProvider(props: Props) {
  return <Context.Provider value={{}} {...props} />;
}

export function useAppContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useAppContext must be used within a AppContextProvider`);
  }
  return context;
}
