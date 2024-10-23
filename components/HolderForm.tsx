import { useState, useEffect } from "react";
import * as wasm from "sdjwt"; // Ensure this points to the correct module

interface HolderFormProps {
  sdJwt: string;
  setHolderSdJwt: (sdJwt: string) => void;
}

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
          {value}
        </div>
      )}
    </span>
  );
};

const HolderForm: React.FC<HolderFormProps> = ({ sdJwt, setHolderSdJwt }) => {
  const [holderPrivateKey, setHolderPrivateKey] = useState<string>("");
  const [issuerPublicKey, setIssuerPublicKey] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [decodedJwt, setDecodedJwt] = useState<any>(null);

  useEffect(() => {
    if (sdJwt) {
      const decodeJwt = (jwt: string) => {
        const parts = jwt.split(".");
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          const signature = parts[2];
          setDecodedJwt({ header, payload, signature });
        }
      };
      decodeJwt(sdJwt);
    }
  }, [sdJwt]);

  const renderJson = (jsonObject: any, indentLevel: number = 0) => {
    const indentStyle = { paddingLeft: `${indentLevel * 20}px` }; // Set indent level

    if (Array.isArray(jsonObject)) {
      // If it's an array, format it
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
      // If it's an object, format it with keys
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

  const handleVerify = async () => {
    // try {
    //   const isValid = await wasm.verify_sd_jwt(sdJwt, issuerPublicKey); // WASM verification logic
    //   setVerified(isValid);
    // } catch (error) {
    //   console.error("Verification error:", error);
    // }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl mb-4">Holder Panel</h2>

      <textarea
        value={sdJwt}
        readOnly
        className="w-full h-80 p-2 border border-gray-300 rounded bg-gray-100 mb-4"
      />

      {decodedJwt && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-bold mb-2">Decoded SD-JWT</h3>
          <div className="overflow-x-auto break-words">
            <pre className="whitespace-pre-wrap">
              <code className="text-red-500">
                {renderJson(decodedJwt.header)}
              </code>
              <br />
              <code className="text-green-500">
                {renderJson(decodedJwt.payload)}
              </code>
              <br />
              <code className="text-blue-500">
                Signature: {decodedJwt.signature}
              </code>
            </pre>
          </div>
        </div>
      )}

      <textarea
        value={issuerPublicKey}
        onChange={(e) => setIssuerPublicKey(e.target.value)}
        placeholder="Issuer Public Key (PEM format)"
        className="w-full mt-4 p-2 border border-gray-300 rounded h-24"
      />
      <button
        onClick={handleVerify}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Verify SD-JWT
      </button>
      {verified && (
        <div className="mt-4 text-green-600">
          <p>SD-JWT Verified Successfully!</p>
        </div>
      )}

      <textarea
        value={holderPrivateKey}
        onChange={(e) => setHolderPrivateKey(e.target.value)}
        placeholder="Holder Private Key (PEM format)"
        className="w-full mt-4 p-2 border border-gray-300 rounded h-24"
      />
      <button
        onClick={() => setHolderSdJwt("")}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Re-sign SD-JWT
      </button>
    </div>
  );
};

export default HolderForm;
