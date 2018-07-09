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
      <div>
        <Provider value={{ keyA_1: { keyB_3: { keyC_1: "Target Value" } } }}>
          <Consumer>
            {value => {
              expect(value).toBeA("object");
              expect(value.keyA_1).toBeA("object");
              expect(value.keyA_1.keyB_3).toBeA("object");
              expect(value.keyA_1.keyB_3.keyC_1).toBe("Target Value");

              return "";
            }}
          </Consumer>
        </Provider>
        <Provider value={{ keyA_1: { keyB_3: { keyC_2: "Target Value" } } }}>
          <Consumer>
            {value => {
              expect(value).toBeA("object");
              expect(value.keyA_1).toBeA("object");
              expect(value.keyA_1.keyB_3).toBeA("object");
              expect(value.keyA_1.keyB_3.keyC_1).toBeFalsy();
              expect(value.keyA_1.keyB_3.keyC_2).toBe("Target Value");
              expect(value.message).toBeFalsy();
              expect(value.message2).toBeFalsy();
              expect(value.message3).toBeFalsy();

              return (
                <div>
                  {"value is " + value.keyA_1.keyB_3.keyC_2}
                  <Provider
                    value={{
                      message: "Hello World;",
                      foreignObject: { only: "here" }
                    }}
                  >
                    <Consumer>
                      {value => {
                        expect(value).toBeA("object");
                        expect(value.keyA_1).toBeA("object");
                        expect(value.keyA_1.keyB_3).toBeA("object");
                        expect(value.keyA_1.keyB_3.keyC_1).toBeFalsy();
                        expect(value.keyA_1.keyB_3.keyC_2).toBe("Target Value");

                        expect(value.message).toBe("Hello World;");

                        return "";
                      }}
                    </Consumer>
                  </Provider>
                  <Provider value={{ message2: "Hello World;" }}>
                    <Consumer>
                      {value => {
                        expect(value.keyA_1).toBeA("object");
                        expect(value.keyA_1.keyB_3).toBeA("object");
                        expect(value.keyA_1.keyB_3.keyC_1).toBeFalsy();
                        expect(value.keyA_1.keyB_3.keyC_2).toBe("Target Value");

                        expect(value.message).toBeFalsy();
                        expect(value.foreignObject).toBeFalsy();
                        expect(value.message2).toBe("Hello World;");
                        expect(value.message3).toBeFalsy();

                        return "";
                      }}
                    </Consumer>
                  </Provider>
                  <Provider value={{ message3: "Hello World;" }}>
                    <Consumer>
                      {value => {
                        expect(value.message).toBeFalsy();
                        expect(value.foreignObject).toBeFalsy();
                        expect(value.message2).toBeFalsy();
                        expect(value.message3).toBe("Hello World;");

                        return "";
                      }}
                    </Consumer>
                  </Provider>
                </div>
              );
            }}
          </Consumer>
        </Provider>,
      </div>,
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
        <Consumer>
          {value => {
            expect(value.message).toBeFalsy();
            expect(value.keyA_1.keyB_3.keyC_1).toBe("Target Value");
            expect(value.keyA_1.keyB_3.keyC_2).toBe("keyC_1");
            expect(value.keyA_1.keyB_3.keyC_3).toBe("Target Value");

            return "value is " + value.keyA_1.keyB_3.keyC_3;
          }}
        </Consumer>
      </Provider>,
      node,
      () => {
        expect(node.innerHTML).toContain("value is Target Value");
      }
    );
  });

  it("keep function value", () => {
    render(
      <Provider
        value={{
          keyA_1: {
            keyB_3: {
              keyC_3: () => {
                return "Target Value";
              }
            }
          }
        }}
      >
        <Consumer>
          {value => {
            expect(value.keyA_1.keyB_3.keyC_3).toBeA("function");
            expect(value.keyA_2).toBeFalsy();

            return "value is " + value.keyA_1.keyB_3.keyC_3();
          }}
        </Consumer>
      </Provider>,
      node,
      () => {
        expect(node.innerHTML).toContain("value is Target Value");
      }
    );
  });
});
