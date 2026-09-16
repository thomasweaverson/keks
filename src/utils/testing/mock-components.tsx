import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter, type InitialEntry } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import type { AxiosInstance } from 'axios';
import { makeFakeState } from './mocks';
import type { TState } from '../../types/state';
import { createAPI } from '../../services/api';

export function withHistory(
  component: ReactNode,
  initialEntries: InitialEntry[] = ['/'],
) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <HelmetProvider>{component}</HelmetProvider>
    </MemoryRouter>
  );
}

export type ComponentWithMockStore = {
  withStoreComponent: ReactElement;
  mockStore: ReturnType<typeof createMockStore>;
  mockAxiosAdapter: MockAdapter;
};

function createMockStore(
  axiosInstance: AxiosInstance,
  initialState: Partial<TState> = {},
) {
  const state = makeFakeState(initialState);

  return configureStore({
    reducer: () => state,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: axiosInstance,
        },
      }),
  });
}

export function withStore(
  component: ReactNode,
  initialState: Partial<TState> = {},
): ComponentWithMockStore {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const mockStore = createMockStore(axios, initialState);

  return {
    withStoreComponent: <Provider store={mockStore}>{component}</Provider>,
    mockStore,
    mockAxiosAdapter,
  };
}
