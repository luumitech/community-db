import React from 'react';
import * as GQL from '~/graphql/generated/graphql';

type State = Readonly<{
  eventList: GQL.SupportedEvent[];
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
  eventList: GQL.SupportedEvent[];
}

export function ContextProvider({ eventList, ...props }: Props) {
  const value = React.useMemo<ContextT>(
    () => ({
      eventList,
      supportedEvents: eventList
        .filter((entry) => !entry.hidden)
        .map((entry) => ({
          label: entry.name,
          value: entry.name,
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
