"use client";

import { useState, useEffect } from "react";
import * as wasm from "sdjwt"; // Ensure this points to the correct module
import Tooltip from "./Tooltip";
import ColorCodedSdJwt from "./ColorCodedSdJwt";

interface HolderFormProps {
  sdJwt: string;
  setHolderSdJwt: (sdJwt: string) => void;
}

const HolderForm: React.FC<HolderFormProps> = ({ sdJwt, setHolderSdJwt }) => {
  const [holderPrivateKey, setHolderPrivateKey] = useState<string>("");
  const [issuerPublicKey, setIssuerPublicKey] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [decodedJwt, setDecodedJwt] = useState<any>(null);
  const [digests, setDigests] = useState<string[]>([]);
  const [redactedDigests, setRedactedDigests] = useState<boolean[]>([]);

  useEffect(() => {
    if (sdJwt) {
      const decodeJwt = (jwt: string) => {
        const parts = jwt.split(".");
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          const signature = parts[2];
          const digestParts = sdJwt
            .split("~")
            .slice(1)
            .filter((digest) => digest.trim() !== "");
          setDigests(digestParts);
          setRedactedDigests(new Array(digestParts.length).fill(false));
          setDecodedJwt({ header, payload, signature });
        }
      };
      decodeJwt(sdJwt);
    } else {
      setDecodedJwt(null);
      setDigests([]);
      setRedactedDigests([]);
    }
  }, [sdJwt]);

  const decodeBase64 = (digest: string) => {
    try {
      return atob(digest);
    } catch (error) {
      console.error("Error decoding digest:", error);
      return "Invalid Base64";
    }
  };

  const toggleRedact = (index: number) => {
    const newRedactedDigests = [...redactedDigests];
    newRedactedDigests[index] = !newRedactedDigests[index];
    setRedactedDigests(newRedactedDigests);
  };

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

      <ColorCodedSdJwt sdJwt={sdJwt} />

      {decodedJwt && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-l font-bold mb-2">Decoded Issuer's SD-JWT</h3>
          <div className="overflow-x-auto break-words">
            <pre className="whitespace-pre-wrap">
              <code className="text-red-500">
                {renderJson(decodedJwt.header)}
              </code>
              <br />
              <code className="text-green-500">
                {renderJson(decodedJwt.payload)}
              </code>
            </pre>
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="text-l font-bold mb-2">Digests</h3>
        {digests.map((digest, index) => (
          <div
            key={index}
            className={`p-2 border-b border-gray-300 flex items-start justify-between ${
              redactedDigests[index] ? "opacity-50" : ""
            }`}
          >
            <div className="flex-1 mr-4">
              {/* Base64 Encoded Digest */}
              <div className="text-sm text-gray-600 break-all">
                <strong>Base64:</strong> {digest || "N/A"}
              </div>

              {/* Decoded Digest */}
              <div className="text-sm text-gray-800 break-all">
                <strong>Decoded:</strong> {decodeBase64(digest) || "N/A"}
              </div>
            </div>

            {/* Redact Toggle Slider */}
            <div className="ml-4 w-24">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={redactedDigests[index]}
                  onChange={() => toggleRedact(index)}
                  className="toggle-checkbox"
                />
                <span className="ml-2 text-sm">
                  {redactedDigests[index] ? "Redacted" : "Redact"}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>

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
