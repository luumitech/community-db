import React from 'react';
import { defineWidget } from '~/view/base/grid-stack';
import { type WidgetMap } from '~/view/base/grid-stack-with-card';
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
const memberCount = defineWidget({
  id: 'memberCount',
  w: 12,
  h: 12,
  x: 0,
  y: 0,
  title: <MemberCount.Title />,
  content: <MemberCount.Chart className="h-full w-full" />,
});
const membershipSource = defineWidget({
  id: 'membershipSource',
  w: 6,
  h: 10,
  x: 0,
  y: memberCount.y! + memberCount.h!,
  title: <MembershipSource.Title />,
  content: <MembershipSource.Chart className="h-full w-full" />,
});
const membershipFee = defineWidget({
  id: 'membershipFee',
  w: 6,
  h: 10,
  x: membershipSource.x! + membershipSource.w!,
  y: memberCount.y! + memberCount.h!,
  title: <MembershipFee.Title />,
  content: <MembershipFee.Chart className="h-full w-full" />,
});
const eventParticipation = defineWidget({
  id: 'eventParticipation',
  w: 6,
  h: 10,
  x: membershipSource.x!,
  y: membershipSource.y! + membershipSource.h!,
  title: <EventParticipation.Title />,
  content: <EventParticipation.Chart className="h-full w-full" />,
});
const byEvent = defineWidget({
  id: 'byEvent',
  w: 6,
  h: 10,
  x: membershipFee.x!,
  y: membershipFee.y! + membershipFee.h!,
  title: <ByEvent.Title />,
  content: <ByEvent.Chart className="h-full w-full" />,
});
const byTicket = defineWidget({
  id: 'byTicket',
  w: 6,
  h: 10,
  x: eventParticipation.x!,
  y: eventParticipation.y! + eventParticipation.h!,
  title: <ByTicket.Title />,
  content: <ByTicket.Chart className="h-full w-full" />,
});

export const allowableWidgets: WidgetMap<WidgetId> = {
  memberCount: {
    widget: memberCount,
    info: {
      label: 'Total Membership Count',
      description:
        'Track how your membership base has grown or shrunk year over year.',
    },
  },
  membershipSource: {
    widget: membershipSource,
    info: {
      label: 'Membership Source',
      description:
        'See which events are driving new memberships. Displays each event as a share of total members acquired, so you can identify your most effective recruitment channels.',
    },
  },
  membershipFee: {
    widget: membershipFee,
    info: {
      label: 'Membership Fee',
      description:
        'Monitor revenue collected from membership fees, broken down by payment method. Useful for reconciling payments and understanding how members prefer to pay.',
    },
  },
  eventParticipation: {
    widget: eventParticipation,
    info: {
      label: 'Event Participation',
      description:
        'Compare attendance across all events in a selected year at a glance. Quickly spot which events drew the biggest crowds and which may need more promotion.',
    },
  },
  byEvent: {
    widget: byEvent,
    info: {
      label: 'Event Details',
      description:
        'Dive into ticket sales metrics for a specific event. Ideal for evaluating individual event success and informing planning for future events.',
    },
  },
  byTicket: {
    widget: byTicket,
    info: {
      label: 'Ticket Details',
      description: 'Dive into ticket sales during the year.',
    },
    hide: true,
  },
};
