import type { GridStackPosition } from 'gridstack';
import React from 'react';

export interface WidgetBase<Id extends string> extends GridStackPosition {
  /**
   * Unique identifier for the widget. This is used to track the widget's
   * position and state within the grid. It should be a string that uniquely
   * identifies the widget, such as a UUID or a unique name. This ID is crucial
   * for saving and restoring the layout of the dashboard, as well as for
   * handling widget interactions and updates.
   */
  id: Id;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = any;

/**
 * Provide a type-safe way to define widgets and their corresponding component
 * props.
 */
export type WidgetDefinition<
  Id extends string = string,
  P extends AnyProps = AnyProps,
> = WidgetBase<Id> & {
  component: React.ComponentType<P>;
  props: P;
};
