import React from 'react';

/**
 * Combining multiple ref instances into a single ref that can be passed to a
 * component.
 *
 * Why?
 *
 * React's `ref` prop can only accept a single ref at a time. If you have
 * multiple sources that require access to the same DOM element or component
 * instance via a ref, you cannot simply assign multiple refs to the `ref` prop
 * directly. Merging refs provides a solution to this limitation.
 *
 * For example:
 *
 * ```ts
 * const MyComponent = React.forwardRef((props, ref) => {
 *   const localRef = React.useRef<HTMLDivElement>(null);
 *
 *   return <div ref={mergeRefs([localRef, ref])} />;
 * });
 * ```
 */
export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}
