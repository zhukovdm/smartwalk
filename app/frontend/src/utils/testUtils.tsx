import { PropsWithChildren, ReactNode } from "react";
import { Provider } from "react-redux";
import { PreloadedState } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { RenderOptions, render } from "@testing-library/react";
import { AppStore, StoreState, setupStore } from "../features/store";

function RouterWrapper({ children }: PropsWithChildren<{}>): JSX.Element {
  return (<MemoryRouter>{children}</MemoryRouter>);
}

function StoreWrapper({ children, store }: PropsWithChildren<{ store: AppStore; }>): JSX.Element {
  return (<Provider store={store}>{children}</Provider>);
}

export function withRouter(ui: ReactNode): JSX.Element {
  return RouterWrapper({ children: ui });
}

export function withStore(ui: ReactNode, store: AppStore): JSX.Element {
  return StoreWrapper({ children: ui, store: store });
}

export function withState(ui: ReactNode, preloadedState?: PreloadedState<StoreState>): JSX.Element {
  return StoreWrapper({ children: ui, store: setupStore(preloadedState) });
}

export function withProviders(ui: ReactNode, preloadedState?: PreloadedState<StoreState>): JSX.Element {
  return withState(withRouter(ui), preloadedState);
}

type StoreRenderOptions = Omit<RenderOptions, "queries"> & {
  preloadedState?: PreloadedState<StoreState>;
};

export function renderWithProviders(
  ui: ReactNode, { preloadedState, ...renderOptions }: StoreRenderOptions) {

  const store = setupStore(preloadedState);
  return {
    store: store,
    ...render(withStore(withRouter(ui), store), { ...renderOptions })
  };
}
