import { createContext } from "react";
import { Provider } from "react-redux";
import { store } from "./features/store";
import { context } from "./features/context";
import MapControl from "./components/MapControl";
import PanelControl from "./components/PanelControl";

export const AppContext = createContext(context);

export default function App(): JSX.Element {

  return (
    <Provider store={store}>
      <MapControl />
      <PanelControl />
    </Provider>
  );
}
