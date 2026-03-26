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

export const widgetName: Record<WidgetId, string> = {
  memberCount: 'Total Membership Count',
  membershipSource: 'Membership Source',
  membershipFee: 'Membership Fee',
  eventParticipation: 'Event Participation',
  byEvent: 'Event Details',
};

/**
 * List of allowable widgets to render in dashboard
 *
 * - Also specifies their default layout positions
 */
export const allowableWidgets: WidgetMap<WidgetId> = {
  memberCount: defineWidget({
    id: 'memberCount',
    w: 12,
    h: 12,
    content: <MemberCountChart className="h-full w-full" />,
  }),
  membershipSource: defineWidget({
    id: 'membershipSource',
    w: 6,
    h: 10,
    content: <MembershipSource className="h-full w-full" />,
  }),
  membershipFee: defineWidget({
    id: 'membershipFee',
    w: 6,
    h: 10,
    content: <MembershipFee className="h-full w-full" />,
  }),
  eventParticipation: defineWidget({
    id: 'eventParticipation',
    w: 6,
    h: 10,
    content: <EventParticipation className="h-full w-full" />,
  }),
  byEvent: defineWidget({
    id: 'byEvent',
    w: 6,
    h: 10,
    content: <ByEvent className="h-full w-full" />,
  }),
};
