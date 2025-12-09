import React from 'react';

/**
 * Useful for copying a forwardref, so you can access/manipulate the content of
 * the forwardref
 */
export function useForwardRef<T>(
  ref: React.ForwardedRef<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue: any = null
) {
  const targetRef = React.useRef<T>(initialValue);

  React.useEffect(() => {
    if (!ref) {
      return;
    }

    if (typeof ref === 'function') {
      ref(targetRef.current);
    } else {
      // eslint-disable-next-line react-hooks/immutability
      ref.current = targetRef.current;
    }
  }, [ref]);

  return targetRef;
}
