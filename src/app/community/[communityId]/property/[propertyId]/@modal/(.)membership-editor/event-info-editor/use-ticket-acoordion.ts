import React from 'react';
import { useHookFormContext } from '../use-hook-form';

/** Return APIs for monitoring/controlling the ticketList accordion section */
export function useTicketAccordion(yearIdx: number) {
  const { setValue, watch } = useHookFormContext();
  const expandTicketControlName =
    `hidden.membershipList.${yearIdx}.expandTicketListEventIdx` as const;
  const expandTicketListEventIdx = watch(expandTicketControlName);

  /** Check if ticketList section of event index is expanded */
  const isExpanded = React.useCallback(
    (eventIdx: number) => expandTicketListEventIdx === eventIdx,
    [expandTicketListEventIdx]
  );

  const expand = React.useCallback(
    (eventIdx: number) => {
      setValue(expandTicketControlName, eventIdx);
    },
    [setValue, expandTicketControlName]
  );

  const collapse = React.useCallback(() => {
    setValue(expandTicketControlName, null);
  }, [setValue, expandTicketControlName]);

  const toggle = React.useCallback(
    (eventIdx: number) => {
      if (isExpanded(eventIdx)) {
        collapse();
      } else {
        expand(eventIdx);
      }
    },
    [isExpanded, collapse, expand]
  );

  return {
    /** Check if the ticketList section of the given event index is expanded */
    isExpanded,
    /** Collapse the ticketList section of the given event index */
    collapse,
    /** Expand the ticketList section of the given event index */
    expand,
    /** Toggle the ticketList section of the given event index */
    toggle,
  };
}
