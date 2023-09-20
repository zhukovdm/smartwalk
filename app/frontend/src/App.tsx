import { createContext } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { context } from "./features/context";
import { store } from "./features/store";
import MapControl from "./components/MapControl";
import PanelEnsemble from "./components/PanelEnsemble";

// context without subscription!

export const AppContext = createContext(context);

export default function App(): JSX.Element {

  return (
    <Provider store={store}>
      <MapControl />
      <BrowserRouter>
        <PanelEnsemble />
      </BrowserRouter>
    </Provider>
  );
}
