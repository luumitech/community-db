import React from 'react';
import { Loading as LoadingDiv } from '~/view/base/loading';

export default function Loading() {
  return (
    <div className="absolute top-0 flex min-h-screen w-full items-center justify-center">
      <LoadingDiv />
    </div>
  );
}
