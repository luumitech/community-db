import type { GridStackWidget } from 'gridstack';
import React from 'react';

type GSWidget = Omit<GridStackWidget, 'id' | 'content'>;
export interface Widget<Id extends string = string> extends GSWidget {
  /**
   * Unique identifier for the widget. This is used to track the widget's
   * position and state within the grid. It should be a string that uniquely
   * identifies the widget, such as a UUID or a unique name. This ID is crucial
   * for saving and restoring the layout of the dashboard, as well as for
   * handling widget interactions and updates.
   */
  id: Id;
  /** React component to render for the widget */
  content: React.ReactNode;
}

export type { RenderItemFn } from './grid-stack-widgets';
export type { OnChangeFn } from './gs-context';
