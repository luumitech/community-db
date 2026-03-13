import React from 'react';

export interface WidgetBase {
  /**
   * Unique identifier for the widget. This is used to track the widget's
   * position and state within the grid. It should be a string that uniquely
   * identifies the widget, such as a UUID or a unique name. This ID is crucial
   * for saving and restoring the layout of the dashboard, as well as for
   * handling widget interactions and updates.
   */
  id: string;
  /**
   * The x and y coordinates specify the position of the widget on the grid,
   * while w and h specify the width and height of the widget in terms of grid
   * units. For example, x: 0, y: 0, w: 3, h: 2 would place the widget at the
   * top-left corner of the grid, spanning 3 columns and 2 rows. These
   * properties are essential for defining the layout of the dashboard and how
   * widgets are arranged within it.
   */
  x?: number;
  y?: number;
  w: number;
  h: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = any;

/**
 * Provide a type-safe way to define widgets and their corresponding component
 * props.
 */
export type WidgetDefinition<P extends AnyProps = AnyProps> = WidgetBase & {
  component: React.ComponentType<P>;
  props: P;
};
