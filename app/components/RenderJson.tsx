// utils/renderJson.tsx
import React from "react";
import Tooltip from "./Tooltip";
import { JSONValue } from "../types";

const renderJson = (jsonObject: JSONValue, indentLevel: number = 0) => {
  const indentStyle = { paddingLeft: `${indentLevel * 20}px` };

  if (Array.isArray(jsonObject)) {
    return (
      <span style={indentStyle}>
        [
        {jsonObject.map((item, index) => (
          <span key={index}>
            {renderJson(item, indentLevel + 1)}
            {index < jsonObject.length - 1 ? ", " : ""}
          </span>
        ))}
        ]
      </span>
    );
  } else if (typeof jsonObject === "object" && jsonObject !== null) {
    return (
      <span style={indentStyle}>
        {"{"}
        {Object.keys(jsonObject).map((key, index) => (
          <span
            key={index}
            style={{
              display: "block",
              paddingLeft: `${(indentLevel + 1) * 20}px`,
            }}
          >
            <strong>{key}</strong>:{" "}
            {renderJson(jsonObject[key], indentLevel + 1)}
            {index < Object.keys(jsonObject).length - 1 ? "," : ""}
          </span>
        ))}
        {"}"}
      </span>
    );
  } else {
    return (
      <Tooltip value={String(jsonObject)}>
        <span>{String(jsonObject)}</span>
      </Tooltip>
    );
  }
};

export default renderJson;
