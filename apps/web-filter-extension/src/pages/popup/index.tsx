import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";

import {Popup} from "@pages/popup/components";
import {createChromeStore} from "@shared/redux/chrome-storage";
import {Theme} from "@pages/popup/styles/Theme";
import "antd/lib/style/index.css";

chrome.tabs.query({active: true, currentWindow: true}, (_tab) => {
  void (async () => {
    chrome.runtime.connect();
    const store = await createChromeStore();

    render(
      <Provider store={store}>
        <Theme>
          <Popup/>
        </Theme>
      </Provider>,
      document.getElementById("popup")
    );
  })();
});
