import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

// Enable animation when item is removed
const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};

type ContextT = Readonly<{
  sortable: ReturnType<typeof useSortable>;
}>;

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface Props extends DivProps {
  className?: string;
  id: string;
}

export function ReorderItem({ className, id, ...props }: Props) {
  const sortable = useSortable({ animateLayoutChanges, id });
  const { setNodeRef, transform, transition } = sortable;

  return (
    <Context.Provider
      value={{
        sortable,
      }}
    >
      <div
        ref={setNodeRef}
        className={className}
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition,
        }}
        {...props}
      />
    </Context.Provider>
  );
}

export function useReorderItemContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useReorderItemContext must be used within a ReorderItem`);
  }
  return context;
}
