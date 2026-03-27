import React from 'react';
import { defineWidget } from '~/view/base/grid-stack';
import { type WidgetMap } from '~/view/base/grid-stack-with-card';
import { MemberCountChart } from './member-count-chart';
import {
  ByEvent,
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
] as const;

export type WidgetId = (typeof widgetIdList)[number];

interface WidgetInfo {
  label: string;
  description?: string;
}

export const widgetInfo: Record<WidgetId, WidgetInfo> = {
  memberCount: {
    label: 'Total Membership Count',
    description:
      'Visualizes the growth or decline of your total membership base over time, with each bar representing the cumulative member count for a given year.',
  },
  membershipSource: {
    label: 'Membership Source',
    description:
      'Breaks down the distribution of how members were acquired, showing the relative contribution of each event as a proportion of total membership.',
  },
  membershipFee: {
    label: 'Membership Fee',
    description:
      'Provides a detailed breakdown of membership fee collection, including payment method and totals to help track revenue from member subscriptions.',
  },
  eventParticipation: {
    label: 'Event Participation',
    description:
      'Compares attendance across all events within a selected year, making it easy to identify your most and least popular events at a glance.',
  },
  byEvent: {
    label: 'Event Details',
    description:
      'Offers a granular view of ticket sales performance for each individual event, including sales volumes and other key metrics to assess event-level success.',
  },
};

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
  content: <MemberCountChart className="h-full w-full" />,
});
const membershipSource = defineWidget({
  id: 'membershipSource',
  w: 6,
  h: 10,
  x: 0,
  y: memberCount.y! + memberCount.h!,
  content: <MembershipSource className="h-full w-full" />,
});
const membershipFee = defineWidget({
  id: 'membershipFee',
  w: 6,
  h: 10,
  x: membershipSource.x! + membershipSource.w!,
  y: memberCount.y! + memberCount.h!,
  content: <MembershipFee className="h-full w-full" />,
});
const eventParticipation = defineWidget({
  id: 'eventParticipation',
  w: 6,
  h: 10,
  x: membershipSource.x!,
  y: membershipSource.y! + membershipSource.h!,
  content: <EventParticipation className="h-full w-full" />,
});
const byEvent = defineWidget({
  id: 'byEvent',
  w: 6,
  h: 10,
  x: membershipFee.x!,
  y: membershipFee.y! + membershipFee.h!,
  content: <ByEvent className="h-full w-full" />,
});
export const allowableWidgets: WidgetMap<WidgetId> = {
  memberCount,
  membershipSource,
  membershipFee,
  eventParticipation,
  byEvent,
};
