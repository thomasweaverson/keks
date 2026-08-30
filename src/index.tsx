import { ToastContainer } from "react-toastify";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";
import 'leaflet/dist/leaflet.css';
import { checkAuthAction } from "./store/api-actions";
import { store } from "./store";
import ReactDOM from "react-dom/client";
import React from "react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import App from "./components/app/app";

store.dispatch(checkAuthAction());

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
          <ToastContainer />
          <App />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>,
);
