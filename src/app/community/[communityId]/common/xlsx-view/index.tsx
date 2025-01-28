import { Skeleton } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { XlsxViewImpl, type XlsxViewImplProps } from './xlsx-view';

interface Props<TData> extends Partial<XlsxViewImplProps<TData>> {
  className?: string;
}

export function XlsxView<T>({ className, data, columns }: Props<T>) {
  const pending = !data || !columns;
  if (pending) {
    return (
      <div className={clsx(className, 'grid grid-cols-4 gap-2')}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 rounded-lg" />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-6 rounded-lg" />
        ))}
      </div>
    );
  }

  return <XlsxViewImpl className={className} data={data} columns={columns} />;
}
