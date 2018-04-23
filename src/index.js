import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import configureStore from "./configureStore";
import LoginOrApp from "./LoginOrApp";

let store = configureStore();

const Root = ({ store }) => (
  <IntlProvider locale={navigator.language} messages={{}}>
    <Provider store={store}>
      <LoginOrApp />
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<Root store={store} />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept("./LoginOrApp", () => {
    const HotApp = require("./LoginOrApp").default;
    ReactDOM.render(
      <IntlProvider locale={navigator.language} messages={{}}>
        <Provider store={store}>
          <HotApp />
        </Provider>
      </IntlProvider>,
      document.getElementById("root")
    );
  });
}
