"use client";

import { useState, useEffect, use } from "react";
import * as wasm from "sdjwt";
import Tooltip from "./Tooltip";
import ColorCodedSdJwt from "./ColorCodedSdJwt";
import { generateRSAPSSKeyPair } from "../utils";

interface HolderFormProps {
  sdJwt: string;
  issuerPublicKey: string;
  setHolderSdJwt: (sdJwt: string) => void;
  setKbKey: (key: string) => void;
}

type HashAlgorithm = "sha-256" | "sha-384" | "sha-512";

interface Disclosure {
  disclosure: string;
  digest: string;
  key?: string;
  value: any;
  salt_len: number;
  algorithm: HashAlgorithm;
}

interface DisclosurePath {
  path: string;
  disclosure: Disclosure;
}

const HolderForm: React.FC<HolderFormProps> = ({
  sdJwt,
  issuerPublicKey,
  setHolderSdJwt,
  setKbKey,
}) => {
  const [holderPrivateKey, setHolderPrivateKey] = useState<string>("");
  const [holderPublicKey, setHolderPublicKey] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [disclosurePaths, setDisclosurePaths] = useState<DisclosurePath[]>([]);
  const [decodedJwt, setDecodedJwt] = useState<any>(null);
  const [digests, setDigests] = useState<string[]>([]);
  const [redactedDigests, setRedactedDigests] = useState<boolean[]>([]);

  useEffect(() => {
    generateRSAPSSKeyPair("SHA-256").then(({ publicKey, privateKey }) => {
      setHolderPublicKey(publicKey);
      setHolderPrivateKey(privateKey);
      setKbKey(publicKey);
    });
  }, []);

  useEffect(() => {
    if (sdJwt && issuerPublicKey) {
      let alg = "";
      const decodeJwt = (jwt: string) => {
        const parts = jwt.split(".");
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]));
          alg = header.alg;
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
      verifyIssuerSignature(alg);
      createPresentation();
    } else {
      setDecodedJwt(null);
      setDigests([]);
      setRedactedDigests([]);
    }
  }, [sdJwt, issuerPublicKey]);

  useEffect(() => {
    createPresentation();
  }, [redactedDigests]);

  const createPresentation = () => {
    const redactedDigestsVector = disclosurePaths
      .filter((_, index) => redactedDigests[index])
      .map((dp: DisclosurePath) => dp.path);
    console.log("Redacted Digests Vector:", redactedDigestsVector);
    try {
      let presentation_builder = new wasm.SdJwtHolder();
      let presentation_sd_jwt = presentation_builder.presentation(
        sdJwt,
        redactedDigestsVector
      );
      console.log("Presentation SD-JWT:", presentation_sd_jwt);
      setHolderSdJwt(presentation_sd_jwt);
    } catch (error) {
      console.error("Error creating presentation:", error);
    }
  };

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
    const indentStyle = { paddingLeft: `${indentLevel * 20}px` };

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

  const verifyIssuerSignature = (alg: string) => {
    let holderJwt = new wasm.SdJwtHolder();
    try {
      const result = holderJwt.verify(sdJwt, issuerPublicKey, alg);
      console.log("Signature verification result:", result);
      setVerified(result);
      setDisclosurePaths(result.disclosure_paths);
    } catch (error) {
      setVerified(false);
      setDisclosurePaths([]);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl mb-4">Holder Panel</h2>

      {verified ? (
        <div className="mt-4 text-green-600">
          <p>Signature Verified</p>
        </div>
      ) : (
        <div className="mt-4 text-red-600">
          <p>Signature Not Verified</p>
        </div>
      )}

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
        {disclosurePaths.map((dp, index) => (
          <div
            key={index}
            className={`p-2 border-b border-gray-300 flex items-start justify-between ${
              redactedDigests[index] ? "opacity-50" : ""
            }`}
          >
            <div className="flex-1 mr-4">
              {/* Base64 Encoded Dosclosure */}
              <div className="text-sm text-gray-600 break-all">
                <strong>Base64:</strong> {dp.disclosure.disclosure || "N/A"}
              </div>

              {/* Decoded zdisclosure */}
              <div className="text-sm text-gray-800 break-all">
                <strong>Decoded:</strong>{" "}
                {decodeBase64(dp.disclosure.disclosure) || "N/A"}
              </div>

              {/* DDisclosure Path */}
              <div className="text-sm text-gray-800 break-all">
                <strong>Path:</strong> {dp.path || "N/A"}
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
        value={holderPrivateKey}
        onChange={(e) => setHolderPrivateKey(e.target.value)}
        placeholder="Holder Private Key (PEM format)"
        className="w-full mt-4 p-2 border border-gray-300 rounded h-24"
      />

      <textarea
        value={holderPublicKey}
        onChange={(e) => setHolderPublicKey(e.target.value)}
        placeholder="Issuer Public Key (PEM format)"
        className="w-full mt-4 p-2 border border-gray-300 rounded h-24"
      />
    </div>
  );
};

export default HolderForm;
