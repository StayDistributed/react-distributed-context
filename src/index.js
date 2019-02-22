import React from "react";

const context = React.createContext({});

const isString = v => typeof v === "string" || v instanceof String;

const isPlainObject = o =>
  !!o &&
  typeof o === "object" &&
  Object.prototype.toString.call(o) === "[object Object]";

const deepMergeObject = (source, target) => {
  const merged = { ...source };

  Object.keys(target).forEach(key => {
    if (isPlainObject(target[key])) {
      merged[key] = deepMergeObject(source[key] || {}, target[key]);
      return;
    }

    merged[key] = target[key];
  });

  return merged;
};

const deepMapObject = object => {
  const mapped = {};

  Object.keys(object).forEach(key => {
    if (isPlainObject(object[key])) {
      mapped[key] = deepMapObject(object[key]);
      return;
    }

    if (isString(object[key]) && /^@/.test(object[key])) {
      mapped[key] = object[object[key].replace(/^@/, "")];
      return;
    }

    mapped[key] = object[key];
  });

  return mapped;
};

const mergeContext = (srcObject, newObject) => {
  const mergedContext = deepMergeObject({ ...srcObject }, { ...newObject });
  return deepMapObject(mergedContext);
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
