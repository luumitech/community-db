import React from 'react';
import { Loading as LoadingDiv } from '~/view/base/loading';

export default function Loading() {
  return (
    <div className="min-h-screen absolute top-0 flex items-center justify-center w-full">
      <LoadingDiv />
    </div>
  );
}
