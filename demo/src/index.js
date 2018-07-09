import React, { Component } from "react";
import { render } from "react-dom";

import { Provider, Consumer } from "../../src";

class Demo extends Component {
  render() {
    return (
      <div>
        <h1>react-distributed-context Demo</h1>
        <Provider value={{ message: "Hello World", color: "#2f2" }}>
          <Consumer>
            {({ message, color }) => <div style={{ color }}>{message}</div>}
          </Consumer>

          <Provider value={{ color: "#22f" }}>
            <Consumer>
              {({ message, color }) => <div style={{ color }}>{message}</div>}
            </Consumer>

            <Provider
              value={{ message: "Hello from react-distributed-context" }}
            >
              <Consumer>
                {({ message, color }) => <div style={{ color }}>{message}</div>}
              </Consumer>
            </Provider>
          </Provider>
        </Provider>
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
