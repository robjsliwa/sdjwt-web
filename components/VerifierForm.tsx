import { useEffect, useState } from "react";
import ColorCodedSdJwt from "./ColorCodedSdJwt";
import renderJson from "./RenderJson";
import * as wasm from "sdjwt";
import { JSONValue, convertToJSON } from "../types";

type VerifiedSdJwt = {
  header: JSONValue;
  restored_claims: JSONValue;
};

interface VerifierFormProps {
  holderSdJwt: string;
  issuerPublicKey: string;
}

const VerifierForm: React.FC<VerifierFormProps> = ({
  holderSdJwt,
  issuerPublicKey,
}) => {
  const [decodedSdJwt, setDecodedSdJwt] = useState<VerifiedSdJwt | null>(null);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    const parts = holderSdJwt.split(".");
    if (parts.length === 3) {
      const header = JSON.parse(atob(parts[0]));
      const alg = header.alg;
      const verifier = new wasm.SdJwtVerifier();
      try {
        const result: VerifiedSdJwt = verifier.verify(
          holderSdJwt,
          issuerPublicKey,
          alg
        );
        setVerified(true);
        setDecodedSdJwt(convertToJSON(result) as VerifiedSdJwt);
      } catch {
        setVerified(false);
      }
    }
  }, [holderSdJwt, issuerPublicKey]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl mb-4">Verifier Panel</h2>

      {verified ? (
        <div className="mt-4 text-green-600">
          <p>Signature Verified</p>
        </div>
      ) : (
        <div className="mt-4 text-red-600">
          <p>Signature Not Verified</p>
        </div>
      )}

      <ColorCodedSdJwt sdJwt={holderSdJwt} title="Holder's Presentation" />

      {decodedSdJwt && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-l font-bold mb-2">
            Reconstructed Holder&apos;s Presentation
          </h3>
          <div className="overflow-x-auto break-words">
            <pre className="whitespace-pre-wrap">
              <code className="text-red-500">
                {renderJson(decodedSdJwt.header)}
              </code>
              <br />
              <code className="text-green-500">
                {renderJson(decodedSdJwt.restored_claims)}
              </code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifierForm;
