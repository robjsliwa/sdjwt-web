"use client";

import { useState, useEffect } from "react";
// import * as wasm from "sdjwt";
import ColorCodedSdJwt from "./ColorCodedSdJwt";
import { generateRSAPSSKeyPair } from "../utils";
import renderJson from "./RenderJson";

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
  value: unknown;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [decodedJwt, setDecodedJwt] = useState<any>(null);
  const [, setDigests] = useState<string[]>([]);
  const [redactedDigests, setRedactedDigests] = useState<boolean[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wasm, setWasm] = useState<any>(null);

  useEffect(() => {
    import("sdjwt").then((module) => {
      setWasm(module);
    });
  }, []);

  useEffect(() => {
    generateRSAPSSKeyPair("SHA-256").then(({ publicKey, privateKey }) => {
      setHolderPublicKey(publicKey);
      setHolderPrivateKey(privateKey);
      setKbKey(publicKey);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdJwt, issuerPublicKey]);

  useEffect(() => {
    createPresentation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redactedDigests]);

  const createPresentation = () => {
    if (!wasm) return;
    if (!sdJwt) return;
    const redactedDigestsVector = disclosurePaths
      .filter((_, index) => redactedDigests[index])
      .map((dp: DisclosurePath) => dp.path);
    try {
      const presentation_builder = new wasm.SdJwtHolder();
      const presentation_sd_jwt = presentation_builder.presentation(
        sdJwt,
        redactedDigestsVector
      );
      setHolderSdJwt(presentation_sd_jwt);
    } catch (error) {
      // TODO: display error to user
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

  const verifyIssuerSignature = (alg: string) => {
    if (!wasm) return;
    const holderJwt = new wasm.SdJwtHolder();
    try {
      const result = holderJwt.verify(sdJwt, issuerPublicKey, alg);
      setVerified(result);
      setDisclosurePaths(result.disclosure_paths);
    } catch {
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

      <ColorCodedSdJwt sdJwt={sdJwt} title="Issuer's SD-JWT" />

      {decodedJwt && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-l font-bold mb-2">
            Decoded Issuer&apos;s SD-JWT
          </h3>
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

              {/* Decoded disclosure */}
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
