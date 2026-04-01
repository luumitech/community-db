import React from 'react';
import { defineWidget } from '~/view/base/grid-stack';
import {
  type WidgetInfo,
  type WidgetMap,
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

export const widgetInfo: Record<WidgetId, WidgetInfo> = {
  membershipStatus: {
    label: 'Membership Status',
    // description:
    //   'Visualizes the growth or decline of your total membership base over time, with each bar representing the cumulative member count for a given year.',
  },
  currentEvent: {
    label: 'Current Event',
    // description:
    //   'Breaks down the distribution of how members were acquired, showing the relative contribution of each event as a proportion of total membership.',
  },
  notesView: {
    label: 'Notes',
    // description:
    //   'Provides a detailed breakdown of membership fee collection, including payment method and totals to help track revenue from member subscriptions.',
  },
  occupantDisplay: {
    label: 'Contact',
  },
  ticketStatus: {
    label: 'Ticket Status',
  },
};

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
  membershipStatus,
  currentEvent,
  notesView: notesView,
  occupantDisplay,
  ticketStatus,
};
