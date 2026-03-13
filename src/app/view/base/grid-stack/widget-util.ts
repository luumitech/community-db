import type { WidgetDefinition } from './_type';

/**
 * When defining widgets, this utility function can be used to provide better
 * type inference and auto-completion for the widget's props. It simply returns
 * the widget definition object, but allows TypeScript to infer the correct
 * types based on the provided component and its props.
 */
export function defineWidget<P extends object>(
  widget: WidgetDefinition<P>
): WidgetDefinition {
  return widget;
}

/**
 * Utility function to generate a unique ID for the widget's container div. This
 * is used to ensure that each widget has a distinct container in the DOM, which
 * is necessary for rendering the widget's content correctly. The ID is
 * generated based on the widget's unique identifier, ensuring that it remains
 * consistent across renders and can be easily referenced when rendering the
 * widget's content.
 */
export function getWidgetDivId(widget: WidgetDefinition) {
  return `widget-${widget.id}`;
}
