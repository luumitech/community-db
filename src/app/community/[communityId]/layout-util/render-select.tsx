import { cn, DropdownItem, DropdownSection } from '@heroui/react';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Link } from '~/view/base/link';
import { type SelectItemT, type SelectSectionT } from './community-context';

export { type SelectItemT } from './community-context';

/**
 * Render items in DropdownMenu components
 *
 * @example
 *
 * ```tsx
 * return (
 *   <DropdownMenu label="Add Ticket">
 *     {renderItems(visiblePaymentMethods)}
 *   </DropdownMenu>
 * );
 * ```
 */
export function renderDropdownItems(items: SelectItemT[]) {
  return items.map((item) => (
    <DropdownItem key={item.key as string} textValue={item.textValue}>
      {item.textValue}
    </DropdownItem>
  ));
}

/**
 * Render sections in DropdownMenu components
 *
 * @example
 *
 * ```tsx
 * return (
 *   <DropdownMenu label="Add Ticket">
 *     {renderDropdownSections(selectPaymentMethodSections)}
 *   </DropdownMenu>
 * );
 * ```
 */
export function renderDropdownSections(sections: SelectSectionT[]) {
  /**
   * When there is only one section, and it has no title, then just render the
   * items directly
   */
  if (sections.length === 1) {
    const firstSection = sections[0];
    if (!firstSection.title?.trim()) {
      return renderDropdownItems([...(firstSection.items ?? [])]);
    }
  }

  return sections.map((section) => (
    <DropdownSection
      key={section.title}
      title={section.title}
      showDivider={section.showDivider}
    >
      {renderDropdownItems([...(section.items ?? [])])}
    </DropdownSection>
  ));
}

/** Redirect user to communityModify event tab */
export function PleaseConfigureEvents(props: { communityId: string }) {
  return (
    <div className="text-sm text-foreground/50">
      Please configure events in{' '}
      <Link
        className="text-sm"
        href={appPath('communityModify', {
          path: { communityId: props.communityId },
          query: { tab: 'events' },
        })}
      >
        {appLabel('communityModify')}
      </Link>
    </div>
  );
}

/** Redirect user to communityModify Payment Method tab */
export function PleaseConfigurePaymentMethods(props: { communityId: string }) {
  return (
    <div className="text-sm text-foreground/50">
      Please configure payment methods in{' '}
      <Link
        className="text-sm"
        href={appPath('communityModify', {
          path: { communityId: props.communityId },
          query: { tab: 'paymentMethods' },
        })}
      >
        {appLabel('communityModify')}
      </Link>
    </div>
  );
}

/** Redirect user to communityModify Tickets tab */
export function PleaseConfigureTickets(props: { communityId: string }) {
  return (
    <div className="text-sm text-foreground/50">
      Please configure tickets in{' '}
      <Link
        className="text-sm"
        href={appPath('communityModify', {
          path: { communityId: props.communityId },
          query: { tab: 'tickets' },
        })}
      >
        {appLabel('communityModify')}
      </Link>
    </div>
  );
}
