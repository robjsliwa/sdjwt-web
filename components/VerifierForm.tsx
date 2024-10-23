import { useState } from "react";

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
      <textarea
        value={holderSdJwt}
        readOnly
        className="w-full h-32 p-2 border border-gray-300 rounded bg-gray-100"
      />
      <input
        type="text"
        value={issuerPublicKey}
        onChange={(e) => setIssuerPublicKey(e.target.value)}
        placeholder="Issuer Public Key (PEM format)"
        className="w-full mt-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleVerify}
        className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Verify SD-JWT
      </button>

      {decodedSdJwt && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(decodedSdJwt, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default VerifierForm;
