import React from 'react';
import { defineWidget } from '~/view/base/grid-stack';
import {
  WidgetTitle,
  type AllowableWidget,
} from '~/view/base/grid-stack-with-card';
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
export const allowableWidgets: AllowableWidget<WidgetId> = {
  membershipStatus: {
    info: {
      label: 'Membership Status',
      description:
        "Review a member's standing for any given year. Also shows other events attended for the year.",
    },
    widget: defineWidget({
      id: 'membershipStatus',
      title: <WidgetTitle>Membership Status</WidgetTitle>,
      content: <MembershipStatus className="h-full w-full" />,
      w: 6,
      h: 3,
    }),
  },
  currentEvent: {
    info: {
      label: 'Current Event',
      description:
        'Look up an event and register the current member as an attendee directly from this widget. Ideal for front-desk check-ins or manual registration.',
    },
    widget: defineWidget({
      id: 'currentEvent',
      title: <WidgetTitle>Current Event</WidgetTitle>,
      content: <CurrentEvent className="h-full w-full" />,
      w: 6,
      h: 3,
    }),
  },
  notesView: {
    info: {
      label: 'Notes',
      description:
        "Read and update notes tied to this household. Useful for logging special requests, follow-ups, or any context that doesn't fit structured fields.",
    },
    widget: defineWidget({
      id: 'notesView',
      title: <WidgetTitle>Notes</WidgetTitle>,
      content: <NotesView className="h-full w-full" />,
      w: 12,
      h: 4,
    }),
  },
  occupantDisplay: {
    info: {
      label: 'Contact',
      description:
        'View and update contact details for everyone in the current household.',
    },
    widget: defineWidget({
      id: 'occupantDisplay',
      title: <WidgetTitle>Contact</WidgetTitle>,
      content: <OccupantDisplay className="h-full w-full" />,
      w: 12,
      h: 4,
    }),
  },
  ticketStatus: {
    info: {
      label: 'Ticket Status',
      description:
        'See a summary of tickets purchased or assigned to this member for a selected year, including status and event associations.',
    },
    widget: defineWidget({
      id: 'ticketStatus',
      title: <WidgetTitle>Ticket Status</WidgetTitle>,
      content: <TicketStatus className="h-full w-full" />,
      w: 6,
      h: 4,
    }),
    hide: true,
  },
};
