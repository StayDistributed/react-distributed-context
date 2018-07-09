import React from "react";
import merge from "lodash/merge";
import mapValues from "lodash/mapValues";
import isObject from "lodash/isObject";
import isString from "lodash/isString";

const context = React.createContext({});

const resolveValues = (value, key, obj) => {
  if (isObject(value)) {
    return mapValues(value, resolveValues);
  }

  if (isString(value) && /^@/.test(value)) {
    return obj[value.replace(/^@/, "")] || value;
  }

  return value;
};

const mergeContext = (srcObject, newObject) => {
  const mergedContext = merge(srcObject, newObject);
  return mapValues(mergedContext, resolveValues);
};

export const Provider = props => (
  <Consumer>
    {value => (
      <context.Provider
        {...props}
        value={mergeContext(value, props.value || {})}
      />
    )}
  </Consumer>
);

Provider.displayName = "ReactDistributedContextProvider";

export const Consumer = props => <context.Consumer {...props} />;

Consumer.displayName = "ReactDistributedContextConsumer";
