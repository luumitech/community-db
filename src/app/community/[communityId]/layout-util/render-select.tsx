import { cn, DropdownItem, DropdownSection } from '@heroui/react';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Link } from '~/view/base/link';
import { SelectItem, SelectSection } from '~/view/base/select';
import { type SelectItemT, type SelectSectionT } from './community-context';

/**
 * Used to render select item when no items are available. By default, if you
 * don't use this, the `Select` component will render 'No items.' in the
 * selection box.
 *
 * This is useful for rendering additional instructions to user when there is no
 * items to be selected.
 */
export function renderEmptyResult(emptyNode: React.ReactNode) {
  return (
    <SelectItem
      classNames={{
        base: cn(
          // Remove the default styling on selected item
          'data-[hover=true]:bg-transparent',
          'data-[selectable=true]:focus:bg-transparent',
          'cursor-default'
        ),
      }}
      key="empty"
      textValue="empty"
      isReadOnly
    >
      {emptyNode}
    </SelectItem>
  );
}

/**
 * Render items in Select components
 *
 * @example
 *
 * ```tsx
 * return (
 *   <Select controlName="paymentMethod">
 *     {renderItems(visiblePaymentMethods)}
 *   </Select>
 * );
 * ```
 */
export function renderItems(items: SelectItemT[]) {
  return items.map((item) => (
    <SelectItem key={item.value} textValue={item.label}>
      {item.label}
    </SelectItem>
  ));
}

/**
 * Render sections in Select components
 *
 * @example
 *
 * ```tsx
 * return (
 *   <Select controlName="paymentMethod">
 *     {renderSections(selectPaymentMethodSections)}
 *   </Select>
 * );
 * ```
 */
export function renderSections(sections: SelectSectionT[]) {
  /**
   * When there is only one section, and it has no title, then just render the
   * items directly
   */
  if (sections.length === 1) {
    const firstSection = sections[0];
    if (!firstSection.title?.trim()) {
      return renderItems(firstSection.items);
    }
  }

  return sections.map((section) => (
    <SelectSection
      key={section.title}
      title={section.title}
      showDivider={section.showDivider}
    >
      {renderItems(section.items)}
    </SelectSection>
  ));
}

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
    <DropdownItem key={item.value} textValue={item.label}>
      {item.label}
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
      return renderDropdownItems(firstSection.items);
    }
  }

  return sections.map((section) => (
    <DropdownSection
      key={section.title}
      title={section.title}
      showDivider={section.showDivider}
    >
      {renderDropdownItems(section.items)}
    </DropdownSection>
  ));
}

/** Redirect user to communityModify event tab */
export function PleaseConfigureEvents(props: { communityId: string }) {
  return (
    <div className="text-sm text-foreground-400">
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
    <div className="text-sm text-foreground-400">
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
    <div className="text-sm text-foreground-400">
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
