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
    description: '',
  },
  membershipSource: {
    label: 'Membership Source',
  },
  membershipFee: {
    label: 'Membership Fee',
  },
  eventParticipation: {
    label: 'Event Participation',
  },
  byEvent: {
    label: 'Event Details',
  },
};

/**
 * List of allowable widgets to render in dashboard
 *
 * - Also specifies their default layout positions
 * - Specifying x,y explicitly allows layout reset to restore layout to the
 *   explicitly specified position
 */
export const allowableWidgets: WidgetMap<WidgetId> = {
  memberCount: defineWidget({
    id: 'memberCount',
    w: 12,
    h: 12,
    x: 0,
    y: 0,
    content: <MemberCountChart className="h-full w-full" />,
  }),
  membershipSource: defineWidget({
    id: 'membershipSource',
    w: 6,
    h: 10,
    x: 0,
    y: 12,
    content: <MembershipSource className="h-full w-full" />,
  }),
  membershipFee: defineWidget({
    id: 'membershipFee',
    w: 6,
    h: 10,
    x: 6,
    y: 12,
    content: <MembershipFee className="h-full w-full" />,
  }),
  eventParticipation: defineWidget({
    id: 'eventParticipation',
    w: 6,
    h: 10,
    x: 0,
    y: 22,
    content: <EventParticipation className="h-full w-full" />,
  }),
  byEvent: defineWidget({
    id: 'byEvent',
    w: 6,
    h: 10,
    x: 6,
    y: 22,
    content: <ByEvent className="h-full w-full" />,
  }),
};
