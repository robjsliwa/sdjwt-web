import React, { useState } from "react";

const unixToHumanReadable = (unixTimestamp: string) => {
  const isValidUnixTimestamp = /^\d{10}(\d{3})?$/.test(unixTimestamp);

  if (isValidUnixTimestamp) {
    try {
      const timestamp = parseInt(unixTimestamp);
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    } catch (error) {
      console.error("Error converting timestamp:", error);
      return undefined;
    }
  } else {
    return undefined;
  }
};

const transformValue = (value: string) => {
  const decoded = unixToHumanReadable(value);
  return decoded ? decoded : value;
};

const Tooltip: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ position: "relative", cursor: "help" }}
    >
      {children}
      {visible && (
        <div
          style={{
            position: "absolute",
            background: "#333",
            color: "#fff",
            padding: "5px",
            borderRadius: "3px",
            whiteSpace: "nowrap",
            top: "-1.5em",
            left: "0",
            zIndex: 10,
          }}
        >
          {transformValue(value)}
        </div>
      )}
    </span>
  );
};

export default Tooltip;
