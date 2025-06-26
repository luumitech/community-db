import React from 'react';
import { useSelector } from '~/custom-hooks/redux';

type ContextT = Readonly<{
  communityId: string;
  eventSelected: string;
  setEventSelected: (event: string) => void;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  communityId: string;
  children: React.ReactNode;
}

export function YearlyProvider({ communityId, ...props }: Props) {
  const { lastEventSelected } = useSelector((state) => state.ui);
  const [eventSelected, setEventSelected] = React.useState(
    lastEventSelected ?? ''
  );
  return (
    <Context.Provider
      value={{
        communityId,
        eventSelected,
        setEventSelected,
      }}
      {...props}
    />
  );
}

export function useYearlyContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useYearlyContext must be used within a YearlyProvider`);
  }
  return context;
}
