import React from 'react';

/** Return APIs for monitoring/controlling the ticketList accordion section */
export function useTicketAccordion(initialFieldId?: string) {
  const [sectionId, setSectionId] = React.useState(initialFieldId);

  /** Check if ticketList section of event index is expanded */
  const isExpanded = React.useCallback(
    (fieldId: string) => sectionId === fieldId,
    [sectionId]
  );

  const expand = React.useCallback((fieldId: string) => {
    setSectionId(fieldId);
  }, []);

  const collapse = React.useCallback(() => {
    setSectionId(undefined);
  }, []);

  const toggle = React.useCallback(
    (fieldId: string) => {
      if (isExpanded(fieldId)) {
        collapse();
      } else {
        expand(fieldId);
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
