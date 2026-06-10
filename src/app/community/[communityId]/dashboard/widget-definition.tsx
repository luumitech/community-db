import React from 'react';
import { defineWidget } from '~/view/base/grid-stack';
import { type AllowableWidget } from '~/view/base/grid-stack-with-card';
import { MemberCount } from './member-count';
import {
  ByEvent,
  ByTicket,
  EventParticipation,
  MembershipFee,
  MembershipSource,
} from './yearly-chart';

/** Allowable widgets that can be rendered in dashboard */
export const widgetIdList = [
  'memberCount',
  'membershipSource',
  'membershipFee',
  'eventParticipation',
  'byEvent',
  'byTicket',
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
  memberCount: {
    info: {
      label: 'Total Membership Count',
      description:
        'Track how your membership base has grown or shrunk year over year.',
    },
    widget: defineWidget({
      id: 'memberCount',
      title: <MemberCount.Title />,
      content: <MemberCount.Chart className="h-full w-full" />,
      minW: 4,
      w: 12,
      h: 12,
    }),
  },
  membershipSource: {
    info: {
      label: 'Membership Source',
      description:
        'See which events are driving new memberships. Displays each event as a share of total members acquired, so you can identify your most effective recruitment channels.',
    },
    widget: defineWidget({
      id: 'membershipSource',
      title: <MembershipSource.Title />,
      content: <MembershipSource.Chart className="h-full w-full" />,
      minW: 4,
      w: 6,
      h: 10,
    }),
  },
  membershipFee: {
    info: {
      label: 'Membership Fee',
      description:
        'Monitor revenue collected from membership fees, broken down by payment method. Useful for reconciling payments and understanding how members prefer to pay.',
    },
    widget: defineWidget({
      id: 'membershipFee',
      title: <MembershipFee.Title />,
      content: <MembershipFee.Chart className="h-full w-full" />,
      minW: 4,
      w: 6,
      h: 10,
    }),
  },
  eventParticipation: {
    info: {
      label: 'Event Participation',
      description:
        'Compare attendance across all events in a selected year at a glance. Quickly spot which events drew the biggest crowds and which may need more promotion.',
    },
    widget: defineWidget({
      id: 'eventParticipation',
      title: <EventParticipation.Title />,
      content: <EventParticipation.Chart className="h-full w-full" />,
      minW: 4,
      w: 6,
      h: 10,
    }),
  },
  byEvent: {
    info: {
      label: 'Event Details',
      description:
        'Dive into ticket sales metrics for a specific event. Ideal for evaluating individual event success and informing planning for future events.',
    },
    widget: defineWidget({
      id: 'byEvent',
      title: <ByEvent.Title />,
      content: <ByEvent.Chart className="h-full w-full" />,
      minW: 4,
      w: 6,
      h: 10,
    }),
  },
  byTicket: {
    info: {
      label: 'Ticket Details',
      description: 'Dive into ticket sales during the year.',
    },
    widget: defineWidget({
      id: 'byTicket',
      title: <ByTicket.Title />,
      content: <ByTicket.Chart className="h-full w-full" />,
      minW: 4,
      w: 6,
      h: 10,
    }),
    hide: true,
  },
};
