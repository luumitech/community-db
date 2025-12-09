'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '~/lib/reducers';

interface Props {}

export const ReduxProviders: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const storeRef = React.useRef<AppStore>(null);

  // Create the store instance the first time this renders
  storeRef.current ??= makeStore();

  return <Provider store={storeRef.current}>{children}</Provider>;
};
