import React from 'react';

type State = Readonly<{
  eventList: string[];
  /**
   * items for Select component
   */
  supportedEvents: {
    label: string;
    value: string;
  }[];
}>;

interface ContextT extends State {}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
  eventList: string[];
}

export function ContextProvider({ eventList, ...props }: Props) {
  const value = React.useMemo<ContextT>(
    () => ({
      eventList,
      supportedEvents: eventList.map((entry) => ({
        label: entry,
        value: entry,
      })),
    }),
    [eventList]
  );
  return <Context.Provider value={value} {...props} />;
}

export function useContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useContext must be used within a ContextProvider`);
  }
  return context;
}
