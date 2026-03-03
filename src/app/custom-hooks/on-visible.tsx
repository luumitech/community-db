import React from 'react';

type UseOnVisibleOptions = Pick<
  IntersectionObserver,
  'thresholds' | 'root' | 'rootMargin'
>;

export function useOnVisible<T extends HTMLElement>(
  callback: () => void,
  opts?: UseOnVisibleOptions
) {
  const elementRef = React.useRef<T | null>(null);

  React.useEffect(() => {
    const node = elementRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        callback();
      }
    }, opts);

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [callback, opts]);

  return elementRef;
}
