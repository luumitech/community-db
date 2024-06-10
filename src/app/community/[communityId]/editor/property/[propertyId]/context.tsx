import React from 'react';
import * as GQL from '~/graphql/generated/graphql';

interface EventSelectItem {
  label: string;
  value: string;
}
interface EventSelectSection {
  title: string;
  items: EventSelectItem[];
  showDivider?: boolean;
}

type State = Readonly<{
  eventList: GQL.SupportedEvent[];
  /**
   * selection items for 'Add new event'
   */
  addEventItems: EventSelectItem[];
  /**
   * selection items for 'Select event'
   */
  selectEventSections: EventSelectSection[];
}>;

interface ContextT extends State {}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
  eventList: GQL.SupportedEvent[];
}

export function ContextProvider({ eventList, ...props }: Props) {
  const value = React.useMemo<ContextT>(() => {
    const visibleEventItems: EventSelectItem[] = [];
    const hiddenEventItems: EventSelectItem[] = [];
    eventList.forEach((entry) => {
      if (entry.hidden) {
        hiddenEventItems.push({ label: entry.name, value: entry.name });
      } else {
        visibleEventItems.push({ label: entry.name, value: entry.name });
      }
    });
    const selectEventSections = [
      {
        title: '',
        items: visibleEventItems,
        showDivider: hiddenEventItems.length > 0,
      },
      { title: 'Deprecated Items', items: hiddenEventItems },
    ];

    return {
      eventList,
      addEventItems: visibleEventItems,
      selectEventSections,
    };
  }, [eventList]);
  return <Context.Provider value={value} {...props} />;
}

export function useContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useContext must be used within a ContextProvider`);
  }
  return context;
}
