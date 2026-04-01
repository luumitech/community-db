import { type Widget } from '~/view/base/grid-stack';

/**
 * Type used to define list of allowable widget,
 *
 * - Indexed by widgetId, so any widgets can be easily managed
 */
export type WidgetMap<WidgetId extends string> = Record<
  WidgetId,
  Widget<WidgetId>
>;

export type WidgetFilterFn<WidgetId extends string> = (
  widget: Widget<WidgetId>
) => boolean;

/**
 * Widget Information for display purpose
 *
 * - Label: short label for widgetId
 * - Description: description for widgetId
 */
export interface WidgetInfo {
  label: string;
  description?: string;
}
