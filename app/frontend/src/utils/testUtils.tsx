import { PropsWithChildren, ReactNode } from "react";
import { Provider } from "react-redux";
import { PreloadedState } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { RenderOptions, render } from "@testing-library/react";
import { AppContext } from "../App";
import { LeafletMap } from "./leaflet";
import InmemStorage from "./inmemStorage";
import {
  AppContextValue,
  context as appContext
} from "../features/context";
import {
  AppStore,
  StoreState,
  setupStore
} from "../features/store";

function ContextWrapper({ children, context }: PropsWithChildren<{ context: AppContextValue }>): JSX.Element {
  return (<AppContext.Provider value={context}>{children}</AppContext.Provider>);
}

function RouterWrapper({ children }: PropsWithChildren<{}>): JSX.Element {
  return (<MemoryRouter>{children}</MemoryRouter>);
}

function StoreWrapper({ children, store }: PropsWithChildren<{ store: AppStore; }>): JSX.Element {
  return (<Provider store={store}>{children}</Provider>);
}

export function withContext(ui: ReactNode, context?: AppContextValue): JSX.Element {
  return ContextWrapper({
    children: ui,
    context: context ?? {
      ...appContext,
      map: new LeafletMap(),
      storage: new InmemStorage()
    }
  })
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

export function withProviders(
  ui: ReactNode, preloadedState?: PreloadedState<StoreState>, context?: AppContextValue): JSX.Element {
  return withContext(withState(withRouter(ui), preloadedState), context);
}

export type AppRenderOptions = Omit<RenderOptions, "queries"> & {
  context?: AppContextValue;
  preloadedState?: PreloadedState<StoreState>;
};

export function renderWithProviders(
  ui: ReactNode, { preloadedState, context, ...renderOptions }: AppRenderOptions) {

  const store = setupStore(preloadedState);

  return {
    store: store,
    ...render(withContext(withStore(withRouter(ui), store), context), { ...renderOptions })
  };
}
