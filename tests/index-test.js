import expect from "expect";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Consumer, Provider } from "src/";

describe("Component", () => {
  let node;

  beforeEach(() => {
    node = document.createElement("div");
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it("displays a static content", () => {
    render(<Consumer>{value => "Hello World"}</Consumer>, node, () => {
      expect(node.innerHTML).toContain("Hello World");
    });
  });

  it("displays merged context values", () => {
    render(
      <Provider value={{ keyA_1: { keyB_3: { keyC_1: "Target Value" } } }}>
        <Consumer>{value => "value is " + value.keyA_1.keyB_3.keyC_1}</Consumer>
      </Provider>,
      node,
      () => {
        expect(node.innerHTML).toContain("value is Target Value");
      }
    );
  });

  it("displays resolved context values", () => {
    render(
      <Provider
        value={{
          keyA_1: {
            keyB_3: {
              keyC_1: "Target Value",
              keyC_2: "keyC_1",
              keyC_3: "@keyC_1"
            }
          }
        }}
      >
        <Consumer>{value => "value is " + value.keyA_1.keyB_3.keyC_3}</Consumer>
      </Provider>,
      node,
      () => {
        expect(node.innerHTML).toContain("value is Target Value");
      }
    );
  });
});
