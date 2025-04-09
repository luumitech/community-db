import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './';

export const listenerMiddleware = createListenerMiddleware();

export const startListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();
