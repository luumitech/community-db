import {
  SelectSection as NextUIPlainSelectSection,
  Select as NextUISelect,
  SelectItem as NextUISelectItem,
  cn,
  type SelectProps as NextUISelectProps,
  type SelectSectionProps,
  type SelectedItemProps,
} from '@heroui/react';
import React from 'react';

/** Enforce shape for SelectItem */
export interface SelectItem extends SelectedItemProps<unknown> {
  key: React.Key;
  textValue: string;
  description?: React.ReactNode;
}

/** Enforce shape for SelectSection */
export interface SelectSection<T extends SelectItem = SelectItem> extends Omit<
  SelectSectionProps<T>,
  'children'
> {}

type CustomNextUISelectProps<T extends SelectItem> = Omit<
  NextUISelectProps<T>,
  'renderValue' | 'children'
>;

type NextUISelectRenderValue = NonNullable<NextUISelectProps['renderValue']>;

export interface PlainSelectProps<
  T extends SelectItem = SelectItem,
> extends CustomNextUISelectProps<T> {
  /** Render items (no sections). If using this, then sections will not be used */
  items?: Iterable<T>;
  /** Render items with sections. If using this, then items will not be used */
  sections?: Iterable<SelectSection<T>>;
  /** Remove all decoration and disable interactions to select */
  isReadOnly?: boolean;
  /**
   * Custom component to display when there is no selection item
   *
   * @default 'No items.'
   */
  emptyContent?: React.ReactNode;
  /**
   * Function to render the value of the selected item(s). If not specified, the
   * textValue of the selected items are displayed.
   */
  renderValue?: (selectedItems: T[]) => React.ReactNode;
}

export const PlainSelect = React.forwardRef(
  <T extends SelectItem>(
    {
      classNames,
      items,
      sections,
      isReadOnly,
      emptyContent,
      renderValue,
      ...selectProps
    }: PlainSelectProps<T>,
    ref: React.ForwardedRef<HTMLSelectElement>
  ) => {
    const hasNoItem =
      items != null
        ? [...items].length === 0
        : sections != null
          ? [...sections].length === 0
          : true;

    /**
     * The component's renderValue only works if a function format is provided
     * to the children of the Select component. Since we are not using function
     * component, we will have to search through the items/sections, to get the
     * appropriate items.
     */
    const customRenderValue = React.useCallback<NextUISelectRenderValue>(
      (selectedItems) => {
        if (!renderValue) {
          return;
        }

        const foundItems: T[] = [];
        const findItem = (iter: Iterable<T>, key: string) => {
          for (const item of iter) {
            if (item.key.toString() === key) {
              foundItems.push(item);
              return item;
            }
          }
        };

        selectedItems.map((selected) => {
          const key = selected.key?.toString();
          if (key) {
            if (items != null) {
              findItem(items, key);
            }
            if (sections != null) {
              for (const section of sections) {
                if (section.items != null) {
                  const found = findItem(section.items, key);
                  if (found) {
                    break;
                  }
                }
              }
            }
          }
        });

        return renderValue(foundItems);
      },
      [renderValue, items, sections]
    );

    return (
      <NextUISelect<T>
        ref={ref}
        classNames={{
          ...classNames,
          base: cn(classNames?.base, { 'opacity-100': isReadOnly }),
          trigger: cn(classNames?.trigger, {
            'border-none bg-transparent shadow-none': isReadOnly,
          }),
          selectorIcon: cn({ hidden: isReadOnly }),
        }}
        items={items}
        {...(isReadOnly && { isDisabled: true })}
        {...(renderValue && { renderValue: customRenderValue })}
        {...selectProps}
      >
        <>
          {hasNoItem && renderEmptyResult(emptyContent)}
          {items != null && renderItems(items)}
          {sections != null && renderSections(sections)}
        </>
      </NextUISelect>
    );
  }
) as (<T extends SelectItem>(
  props: PlainSelectProps<T> & { ref?: React.ForwardedRef<HTMLSelectElement> }
) => React.ReactElement) & { displayName?: string };

PlainSelect.displayName = 'PlainSelect';

/**
 * Used to render select item when no items are available. By default, if you
 * don't use this, the `Select` component will render 'No items.' in the
 * selection box.
 *
 * This is useful for rendering additional instructions to user when there is no
 * items to be selected.
 */
function renderEmptyResult(emptyNode?: React.ReactNode) {
  return (
    <NextUISelectItem
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
      {emptyNode ?? (
        <span className="text-sm text-foreground/50">No items.</span>
      )}
    </NextUISelectItem>
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
function renderItems(_items: Iterable<SelectItem>) {
  const items = [..._items];
  return items.map((item) => (
    <NextUISelectItem
      key={item.key}
      textValue={item.textValue}
      description={item.description}
      {...item.props}
    >
      {item.rendered ?? item.textValue}
    </NextUISelectItem>
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
function renderSections(_sections: Iterable<SelectSection>) {
  const sections = [..._sections];

  /**
   * When there is only one section, and it has no title, then just render the
   * items directly
   */
  if (sections.length === 1) {
    const firstSection = sections[0];
    if (!firstSection.title?.trim()) {
      return renderItems(firstSection.items ?? []);
    }
  }

  return sections.map((section) => (
    <NextUIPlainSelectSection
      key={section.title}
      title={section.title}
      showDivider={section.showDivider}
    >
      {renderItems(section.items ?? [])}
    </NextUIPlainSelectSection>
  ));
}
