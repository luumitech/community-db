import { cn } from '@heroui/react';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { type EventAttendedListFieldArray } from '../use-hook-form';

interface Props {
  className?: string;
  eventAttendedListMethods: EventAttendedListFieldArray;
  eventIdx: number;
}

export const EventAction: React.FC<Props> = ({
  className,
  eventAttendedListMethods,
  eventIdx,
}) => {
  const { remove } = eventAttendedListMethods;

  return (
    <FlatButton
      className={cn(className, 'text-danger')}
      icon="trash"
      tooltip="Remove Event"
      onClick={() => remove(eventIdx)}
    />
  );
};
