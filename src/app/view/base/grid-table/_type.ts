export interface ClassNameConfig {
  /**
   * Classes applied to the outermost grid container
   *
   * For example:
   *
   * - Good for specifying grid layout
   */
  gridContainer?: string;
  /**
   * Classes applied to both header and body container
   *
   * For example:
   *
   * - Good for specifying cell gap
   */
  commonContainer?: string;
  /** Classes applied to sticky header element */
  headerSticky?: string;
  /**
   * Classes applied to header container
   *
   * For example:
   *
   * - Good for specifying text styles within header
   */
  headerContainer?: string;
  /**
   * Classes applied to the header <CardBody>
   *
   * For example:
   *
   * - Good for defining grid spacing
   */
  headerGrid?: string;
  /**
   * Classes applied to body container
   *
   * For example:
   *
   * - Good for specifying text styles within data rows
   */
  bodyContainer?: string;
  /**
   * Classes applied to the header <CardBody>
   *
   * For example:
   *
   * - Good for defining grid spacing
   */
  bodyGrid?: string;
}

/**
 * Render a header column cell
 *
 * @param columnKey Column key to render
 */
export type HeaderRenderer<C extends string> = (
  columnKey: C
) => React.ReactNode;

export type SortDirection = 'ascending' | 'descending';

/**
 * Currently active sort descriptor
 *
 * @param columnKey Column key to render
 */
export interface SortDescriptor<C extends string> {
  columnKey: C;
  direction: SortDirection;
}

/** All items must confirm to this shape */
export interface ItemWithId {
  // Unique ID for each item
  id: string;
}

/**
 * Render a column cell of a given row item
 *
 * @param columnKey Column key to render
 * @param item Item of a row
 */
export type ItemRenderer<C extends string, ItemT> = (
  columnKey: C,
  item: ItemT
) => React.ReactNode;

export interface CommonProps<K extends readonly string[] = readonly string[]> {
  /** Global classes configuration object */
  config?: ClassNameConfig;
  /** List of valid column keys for the grid table */
  columnKeys: K;
  /**
   * ClassName for defining cell configuration,
   *
   * - By default, it behaves as col-span-1
   */
  columnConfig?: Partial<Record<K[number], string>>;
  /** List of column keys with sortable enabled */
  sortableColumnKeys?: K[number][];
}

/**
 * Configuration object to enable virtualization of the component
 *
 * I.e. Only render visible rows
 *
 * - NOTE: this requires the parent to have a defined height
 */
export interface VirtualConfig {
  /**
   * Enable tanstack virtualization to only render items that are visible in the
   * viewport
   *
   * - NOTE: this requires the parent to have a defined height
   */
  isVirtualized?: boolean;
  /**
   * This function is passed the index of each item and should return the actual
   * size (or estimated size if you will be dynamically measuring items with
   * virtualItem.measureElement) for each item. This measurement should return
   * either the height of each row.
   *
   * See: https://tanstack.com/virtual/latest/docs/api/virtualizer#estimatesize
   */
  estimateSize: (index: number) => number;
  /**
   * This optional function is called when the virtualizer needs to dynamically
   * measure the size (width or height) of an item.
   *
   * See:
   * https://tanstack.com/virtual/latest/docs/api/virtualizer#measureelement
   */
  measureElement?: (elem: HTMLDivElement) => number;
  /**
   * This option allows you to set the spacing between items in the virtualized
   * list. It's particularly useful for maintaining a consistent visual
   * separation between items without having to manually adjust each item's
   * margin or padding. The value is specified in pixels.
   *
   * This should match the gap specified in `gridContainer` class
   *
   * Default: 8 (i.e. gap-2)
   *
   * See: https://tanstack.com/virtual/latest/docs/api/virtualizer#gap
   */
  gap?: number;
}
