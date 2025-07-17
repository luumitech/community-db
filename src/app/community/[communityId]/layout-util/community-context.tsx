'use client';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentYear } from '~/lib/date-util';
import { insertIf } from '~/lib/insert-if';
import { type CommunityEntry } from './community-query';

interface SelectItem {
  label: string;
  value: string;
}
interface SelectSection {
  title: string;
  items: SelectItem[];
  showDivider?: boolean;
}

export type CommunityState = Readonly<{
  /** Community entry */
  community: CommunityEntry;
  /** Community short ID */
  communityId: string;
  /** Community name */
  communityName: string;
  /** Access role items */
  roleItems: SelectItem[];
  /** Minimum membership year recorded within membership */
  minYear: number;
  /** Maximum membership year recorded within membership */
  maxYear: number;
  /** Visible items (suitable for 'Add new --') */
  visibleEventItems: SelectItem[];
  visibleTicketItems: SelectItem[];
  visiblePaymentMethods: SelectItem[];
  /** All items (including hidden, suitable for modify existing selection) */
  selectEventSections: SelectSection[];
  selectTicketSections: SelectSection[];
  selectPaymentMethodSections: SelectSection[];
  /** Ticket default configurations */
  ticketDefault: Map<string, GQL.SupportedTicketItem>;
  defaultSetting: GQL.DefaultSetting;
  /** Has Geoapify API key been specified */
  hasGeoapifyApiKey: boolean;
}>;

/**
 * Given a list of Supported items, group all visible items into `visibleItems`,
 * and create selection sections that contains all visible and hidden items
 *
 * @param list List of Supported items
 * @returns
 */
function createSelectionItems(
  list: (
    | GQL.SupportedEventItem
    | GQL.SupportedTicketItem
    | GQL.SupportedPaymentMethod
  )[]
) {
  const visibleItems: SelectItem[] = [];
  const hiddenItems: SelectItem[] = [];
  list.forEach((entry) => {
    if (entry.hidden) {
      hiddenItems.push({ label: entry.name, value: entry.name });
    } else {
      visibleItems.push({ label: entry.name, value: entry.name });
    }
  });
  const selectSections = [
    ...insertIf(visibleItems.length > 0, {
      title: '',
      items: visibleItems,
      showDivider: hiddenItems.length > 0,
    }),
    ...insertIf(hiddenItems.length > 0, {
      title: 'Deprecated Items',
      items: hiddenItems,
    }),
  ];
  return {
    visibleItems,
    selectSections,
  };
}

export function useCommunityContext(community: CommunityEntry) {
  const stateValue = React.useMemo<CommunityState>(() => {
    const eventList = community.eventList ?? [];
    const ticketList = community.ticketList ?? [];
    const paymentMethodList = community.paymentMethodList ?? [];

    const roleItems: SelectItem[] = [
      { label: 'Admin', value: GQL.Role.Admin },
      { label: 'Editor', value: GQL.Role.Editor },
      { label: 'Viewer', value: GQL.Role.Viewer },
    ];
    const eventSelect = createSelectionItems(eventList);
    const ticketSelect = createSelectionItems(ticketList);
    const paymentMethodSelect = createSelectionItems(paymentMethodList);

    const hasGeoapifyApiKey = !!community.geoapifySetting?.apiKey;

    return {
      community,
      communityId: community.id,
      communityName: community.name,
      roleItems,
      minYear: community.minYear ?? getCurrentYear(),
      maxYear: community.maxYear ?? getCurrentYear(),
      visibleEventItems: eventSelect.visibleItems,
      visibleTicketItems: ticketSelect.visibleItems,
      visiblePaymentMethods: paymentMethodSelect.visibleItems,
      selectEventSections: eventSelect.selectSections,
      selectTicketSections: ticketSelect.selectSections,
      selectPaymentMethodSections: paymentMethodSelect.selectSections,
      ticketDefault: new Map(ticketList.map((entry) => [entry.name, entry])),
      defaultSetting: community.defaultSetting ?? {
        __typename: 'DefaultSetting',
      },
      hasGeoapifyApiKey,
    };
  }, [community]);

  return stateValue;
}
