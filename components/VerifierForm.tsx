import { useState } from "react";
import ColorCodedSdJwt from "./ColorCodedSdJwt";

interface VerifierFormProps {
  holderSdJwt: string;
}

const VerifierForm: React.FC<VerifierFormProps> = ({ holderSdJwt }) => {
  const [issuerPublicKey, setIssuerPublicKey] = useState<string>("");
  const [decodedSdJwt, setDecodedSdJwt] = useState<object | null>(null);

  const handleVerify = async () => {
    // Call WASM function to verify SD-JWT
    // const decoded = await window.sdJwtModule.verifySdJwt(
    //   holderSdJwt,
    //   issuerPublicKey
    // );
    // setDecodedSdJwt(decoded);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl mb-4">Verifier Panel</h2>
      <ColorCodedSdJwt sdJwt={holderSdJwt} />

      {decodedSdJwt && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(decodedSdJwt, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default VerifierForm;
