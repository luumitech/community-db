import type { Widget } from './_type';

/**
 * When defining widgets, this utility function can be used to provide better
 * type inference.
 */
export function defineWidget<Id extends string>(
  widget: Widget<Id>
): Widget<Id> {
  return widget;
}
