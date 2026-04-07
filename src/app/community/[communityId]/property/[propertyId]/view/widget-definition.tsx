import React from 'react';
import { defineWidget } from '~/view/base/grid-stack';
import { type WidgetMap } from '~/view/base/grid-stack-with-card';
import { CurrentEvent } from './current-event';
import { MembershipStatus } from './membership-status';
import { NotesView } from './notes-view';
import { OccupantDisplay } from './occupant-display';
import { TicketStatus } from './ticket-status';

/** Allowable widgets that can be rendered in dashboard */
export const widgetIdList = [
  'membershipStatus',
  'currentEvent',
  'notesView',
  'occupantDisplay',
  'ticketStatus',
] as const;

export type WidgetId = (typeof widgetIdList)[number];

/**
 * List of allowable widgets to render in dashboard
 *
 * - Also specifies their default layout positions
 * - Specifying x,y explicitly allows layout reset to restore layout to the
 *   explicitly specified position
 */
const membershipStatus = defineWidget({
  id: 'membershipStatus',
  w: 6,
  h: 3,
  x: 0,
  y: 0,
  content: <MembershipStatus className="h-full w-full" />,
});
const currentEvent = defineWidget({
  id: 'currentEvent',
  w: 6,
  h: 3,
  x: membershipStatus.x! + membershipStatus.w!,
  y: membershipStatus.y!,
  content: <CurrentEvent className="h-full w-full" />,
});
const notesView = defineWidget({
  id: 'notesView',
  w: 12,
  h: 4,
  x: membershipStatus.x!,
  y: membershipStatus.y! + membershipStatus.h!,
  content: <NotesView className="h-full w-full" />,
});
const occupantDisplay = defineWidget({
  id: 'occupantDisplay',
  w: 12,
  h: 4,
  x: notesView.x!,
  y: notesView.y! + notesView.h!,
  content: <OccupantDisplay className="h-full w-full" />,
});
const ticketStatus = defineWidget({
  id: 'ticketStatus',
  w: 6,
  h: 4,
  x: occupantDisplay.x!,
  y: occupantDisplay.y! + occupantDisplay.h!,
  content: <TicketStatus className="h-full w-full" />,
});

export const allowableWidgets: WidgetMap<WidgetId> = {
  membershipStatus: {
    widget: membershipStatus,
    info: {
      label: 'Membership Status',
      description:
        "Review a member's standing for any given year. Also shows other events attended for the year.",
    },
  },
  currentEvent: {
    widget: currentEvent,
    info: {
      label: 'Current Event',
      description:
        'Look up an event and register the current member as an attendee directly from this widget. Ideal for front-desk check-ins or manual registration.',
    },
  },
  notesView: {
    widget: notesView,
    info: {
      label: 'Notes',
      description:
        "Read and update notes tied to this household. Useful for logging special requests, follow-ups, or any context that doesn't fit structured fields.",
    },
  },
  occupantDisplay: {
    widget: occupantDisplay,
    info: {
      label: 'Contact',
      description:
        'View and update contact details for everyone in the current household.',
    },
  },
  ticketStatus: {
    widget: ticketStatus,
    info: {
      label: 'Ticket Status',
      description:
        'See a summary of tickets purchased or assigned to this member for a selected year, including status and event associations.',
    },
    hide: true,
  },
};
