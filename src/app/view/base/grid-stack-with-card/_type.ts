import { type Widget } from '~/view/base/grid-stack';

/**
 * Type used to define list of allowable widget,
 *
 * - Indexed by widgetId, so any widgets can be easily managed
 */
export type WidgetMap<WidgetId extends string> = Record<
  WidgetId,
  {
    /** Contains widget dimension, render function */
    widget: Widget<WidgetId>;
    /** Contains widget labels, descriptions */
    info: WidgetInfo;
    /**
     * Whether widgets should be hidden by default
     *
     * - By default, if localstorage is not configured, the widget is shown, turn
     *   this on to hide the widget upon initialization
     */
    hide?: boolean;
  }
>;

export type WidgetFilterFn<WidgetId extends string> = (
  widget: Widget<WidgetId>
) => boolean;

/** Additional Widget Information (used exclusively in GridStackWithCard) */
export interface WidgetInfo {
  /**
   * Short label for widgetId
   *
   * - Used in widget configuration
   */
  label: string;
  /**
   * A more verbose description for widgetId
   *
   * - Used in widget configuration
   */
  description?: string;
}
