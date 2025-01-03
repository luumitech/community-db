import { Spinner } from '@nextui-org/react';
import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen absolute top-0 flex items-center justify-center w-full">
      <Spinner
        classNames={{
          wrapper: 'h-16 w-16',
        }}
        color="default"
      />
    </div>
  );
}
