import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import { Popup } from "@src/pages/popup/components";
import { createChromeStore } from "@src/pages/popup/redux/chrome-storage";
import { rootReducer } from "@src/pages/popup/redux/reducers";
import { Theme } from "@src/pages/popup/styles/Theme";
import "antd/lib/style/index.css";

chrome.tabs.query({ active: true, currentWindow: true }, (_tab) => {
  void (async () => {
    chrome.runtime.connect();
    const store = await createChromeStore();

    render(
      <Provider store={store}>
        <Theme>
          <Popup />
        </Theme>
      </Provider>,
      document.getElementById("popup")
    );
  })();
});
