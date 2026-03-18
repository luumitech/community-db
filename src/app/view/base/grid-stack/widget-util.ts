import * as R from 'remeda';
import type { WidgetDefinition } from './_type';

/**
 * When defining widgets, this utility function can be used to provide better
 * type inference and auto-completion for the widget's props. It simply returns
 * the widget definition object, but allows TypeScript to infer the correct
 * types based on the provided component and its props.
 */
export function defineWidget<Id extends string, P extends object>(
  widget: WidgetDefinition<Id, P>
): WidgetDefinition<Id, P> {
  return widget;
}

export function isWidgetDefinitionsEqual(
  a: WidgetDefinition[] | undefined,
  b: WidgetDefinition[] | undefined
) {
  const isEqual = R.isDeepEqual(
    a?.map((w) => R.omit(w, ['component'])),
    b?.map((w) => R.omit(w, ['component']))
  );
  return isEqual;
}
