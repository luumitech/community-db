import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from './listener';
import { reducer } from './reducers';

export const makeStore = () => {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      let mw = getDefaultMiddleware();
      // @ts-expect-error NOTE: Since this can receive actions with functions inside,
      // it should go before the serializability check middleware
      mw = mw.prepend(listenerMiddleware.middleware);
      return mw;
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export { actions } from './reducers';
