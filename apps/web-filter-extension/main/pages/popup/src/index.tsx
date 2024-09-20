import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";

import {Popup} from "@src/components";
import {createChromeStore} from "@shared/redux/chrome-storage";
import {Theme} from "@src/styles/Theme";
import 'antd/es/slider/style';
import 'antd/es/select/style';
import * as ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("popup") as HTMLElement);

chrome.tabs.query({active: true, currentWindow: true}, (_tab) => {
  void (async () => {
    chrome.runtime.connect();
    const store = await createChromeStore();

    root.render(
      <Provider store={store}>
        <Theme>
          <Popup/>
        </Theme>
      </Provider>
    );
  })();
});
