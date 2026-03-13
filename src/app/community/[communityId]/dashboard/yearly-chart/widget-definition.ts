import { cn } from '@heroui/react';
import React from 'react';
import { defineWidget } from '~/view/base/grid-stack';
import { ByEvent } from './by-event';
import { EventParticipation } from './event-participation';
import { MembershipFee } from './membership-fee';
import { MembershipSource } from './membership-source';

const WIDGET_HEIGHT = 10;

export function useWidgetDefinition() {
  const widgets = React.useMemo(
    () => [
      defineWidget({
        id: 'membership-source',
        w: 6,
        h: WIDGET_HEIGHT,
        component: MembershipSource,
        props: {
          className: cn('h-full w-full'),
        },
      }),
      defineWidget({
        id: 'membership-fee',
        w: 6,
        h: WIDGET_HEIGHT,
        component: MembershipFee,
        props: {
          className: cn('h-full w-full'),
        },
      }),
      defineWidget({
        id: 'event-participation',
        w: 6,
        h: WIDGET_HEIGHT,
        component: EventParticipation,
        props: {
          className: cn('h-full w-full'),
        },
      }),
      defineWidget({
        id: 'by-event',
        w: 6,
        h: WIDGET_HEIGHT,
        component: ByEvent,
        props: {
          className: cn('h-full w-full'),
        },
      }),
    ],
    []
  );

  return widgets;
}
