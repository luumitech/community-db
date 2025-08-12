import React from 'react';

type ContextT = Readonly<{
  selectTooltip?: React.ReactNode;
  setSelectTooltip: (tooltip?: React.ReactNode) => void;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

export function PageProvider({ ...props }: Props) {
  const [selectTooltip, setSelectTooltip] = React.useState<React.ReactNode>();

  return (
    <Context.Provider
      value={{
        selectTooltip,
        setSelectTooltip,
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
