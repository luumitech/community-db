import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  useStore as useReduxStore,
} from 'react-redux';
import type { AppDispatch, AppStore, RootState } from '~/lib/reducers';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
export const useSelector = useReduxSelector.withTypes<RootState>();
export const useStore = useReduxStore.withTypes<AppStore>();

// Export commonly used methods from toolkits
export { addListener, removeListener } from '@reduxjs/toolkit';
export { actions } from '~/lib/reducers';
