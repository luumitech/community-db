import React from 'react';
import { createPortal } from 'react-dom';

interface Props {
  /** Container to render the widget into. */
  container: Element;
  /** Widget content to render */
  children: React.ReactNode;
}

export const WidgetPortal: React.FC<Props> = ({ container, children }) => {
  return createPortal(children, container);
};
