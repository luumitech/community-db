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
}
