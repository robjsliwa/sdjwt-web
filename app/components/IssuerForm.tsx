"use client";

import { useState, useEffect } from "react";
import { generateRSAPSSKeyPair, generateECDSAKeyPair } from "../utils";

interface IssuerFormProps {
  setSdJwt: (sdJwt: string) => void;
  setIssuerPublicKey: (publicKey: string) => void;
  kbKey: string;
}

const alg2sha_curve_mapping: { [key: string]: string } = {
  RS256: "SHA-256",
  RS384: "SHA-384",
  RS512: "SHA-512",
  PS256: "SHA-256",
  PS384: "SHA-384",
  PS512: "SHA-512",
  ES256: "P-256",
  ES384: "P-384",
  ES512: "P-512",
};

const sampleSDClaims = `sub: user_42
!sd given_name: John
!sd family_name: Doe
email: johndoe@example.com
phone_number: +1-555-123-1234
phone_number_verified: true
address:
    !sd street_address: 123 Main St
    !sd locality: Anytown
    region: Anystate
    country: US
birthdate: 1940-01-01
updated_at: 1570000000
nationalities:
    - !sd US
    - !sd PL`;

const useKeyPair = (algorithm: string) => {
  const [keyPair, setKeyPair] = useState<{
    publicKey: string;
    privateKey: string;
  } | null>(null);

  useEffect(() => {
    const shaCurveName = alg2sha_curve_mapping[algorithm];
    const generateKeyPair = algorithm.startsWith("ES")
      ? generateECDSAKeyPair
      : generateRSAPSSKeyPair;

    generateKeyPair(shaCurveName).then(setKeyPair);
  }, [algorithm]);

  return keyPair;
};

const IssuerForm: React.FC<IssuerFormProps> = ({
  setSdJwt,
  setIssuerPublicKey,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  kbKey,
}) => {
  const [yamlData, setYamlData] = useState<string>(sampleSDClaims);
  const [algorithm, setAlgorithm] = useState<string>("RS256");
  const [yamlError, setYamlError] = useState<boolean>(false);
  const [keyError, setKeyError] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wasm, setWasm] = useState<any>(null);

  const [userPrivateKey, setUserPrivateKey] = useState<string>("");
  const [userPublicKey, setUserPublicKey] = useState<string>("");

  const generatedKeyPair = useKeyPair(algorithm);

  const privateKey = userPrivateKey || generatedKeyPair?.privateKey || "";
  const publicKey = userPublicKey || generatedKeyPair?.publicKey || "";

  useEffect(() => {
    import("sdjwt").then(setWasm);
  }, []);

  useEffect(() => {
    if (publicKey) setIssuerPublicKey(publicKey);
  }, [publicKey, setIssuerPublicKey]);

  useEffect(() => {
    if (wasm && privateKey && yamlData) {
      const issuer = new wasm.SdJwtIssuer();
      try {
        const jwt = issuer.encode(yamlData, privateKey, algorithm);
        setSdJwt(jwt);
        setYamlError(false);
        setKeyError(false);
      } catch (error) {
        setSdJwt("");
        setYamlError(String(error).includes("YAML parsing error"));
        setKeyError(String(error).includes("encoding key"));
        console.error("Error encoding JWT:", error);
      }
    }
  }, [wasm, yamlData, privateKey, algorithm, setSdJwt]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl mb-4">Issuer Panel</h2>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Signing Algorithm:
      </label>
      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="RS256">RS256</option>
        <option value="RS384">RS384</option>
        <option value="RS512">RS512</option>
        <option value="PS256">PS256</option>
        <option value="PS384">PS384</option>
        <option value="PS512">PS512</option>
        {/* <option value="ES256">ES256</option>
        <option value="ES384">ES384</option>
        <option value="ES512">ES512</option> */}
      </select>
      <textarea
        value={yamlData}
        onChange={(e) => setYamlData(e.target.value)}
        placeholder={sampleSDClaims}
        className={`w-full h-80 p-2 border ${
          yamlError ? "text-red-500" : ""
        } rounded`}
      />
      <textarea
        value={userPrivateKey || privateKey}
        onChange={(e) => setUserPrivateKey(e.target.value)}
        placeholder="Issuer Private Key (PEM format)"
        className={`w-full mt-4 p-2 border ${
          keyError ? "text-red-500" : ""
        } rounded h-28`}
      />
      <textarea
        value={userPublicKey || publicKey}
        onChange={(e) => setUserPublicKey(e.target.value)}
        placeholder="Issuer Public Key (PEM format)"
        className="w-full mt-4 p-2 border border-gray-300 rounded h-28"
      />
    </div>
  );
};

export default IssuerForm;
