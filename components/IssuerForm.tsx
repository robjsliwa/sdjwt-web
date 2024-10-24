"use client";

import { useState, useEffect, use } from "react";
import * as wasm from "sdjwt";
import { generateRSAPSSKeyPair } from "../utils";

interface IssuerFormProps {
  setSdJwt: (sdJwt: string) => void;
}

const alg2sha_mapping: { [key: string]: string } = {
  RS256: "SHA-256",
  RS384: "SHA-384",
  RS512: "SHA-512",
  PS256: "SHA-256",
  PS384: "SHA-384",
  PS512: "SHA-512",
  ES256: "SHA-256",
  ES384: "SHA-384",
  ES512: "SHA-512",
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

const IssuerForm: React.FC<IssuerFormProps> = ({ setSdJwt }) => {
  const [yamlData, setYamlData] = useState<string>(sampleSDClaims);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<string>("RS256");
  const [yamlError, setYamlError] = useState<boolean>(false);
  const [keyError, setKeyError] = useState<boolean>(false);
  const [keyBinding, setKeyBinding] = useState<boolean>(false);

  useEffect(() => {
    const shaName = alg2sha_mapping[algorithm];
    if (
      algorithm === "ES256" ||
      algorithm === "ES384" ||
      algorithm === "ES512"
    ) {
      // TODO
    } else {
      generateRSAPSSKeyPair(shaName).then(({ publicKey, privateKey }) => {
        setPublicKey(publicKey);
        setPrivateKey(privateKey);
      });
    }
  }, [algorithm]);

  useEffect(() => {
    if (privateKey && yamlData) {
      const issuer = new wasm.SdJwtIssuer();
      try {
        const jwt = issuer.encode(yamlData, privateKey);
        setSdJwt(jwt);
        setYamlError(false);
        setKeyError(false);
      } catch (error) {
        if (String(error).includes("YAML parsing error")) {
          setSdJwt("");
          setYamlError(true);
          setKeyError(false);
        } else if (String(error).includes("encoding key")) {
          setSdJwt("");
          setKeyError(true);
          setYamlError(false);
        } else {
          console.error("Error encoding JWT:", error);
        }
      }
    }
  }, [yamlData, privateKey]);

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
        <option value="ES256">ES256</option>
        <option value="ES384">ES384</option>
        <option value="ES512">ES512</option>
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
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        placeholder="Issuer Private Key (PEM format)"
        className={`w-full mt-4 p-2 border ${
          keyError ? "text-red-500" : ""
        } rounded h-28`}
      />
      <textarea
        value={publicKey}
        onChange={(e) => setPublicKey(e.target.value)}
        placeholder="Issuer Public Key (PEM format)"
        className="w-full mt-4 p-2 border border-gray-300 rounded h-28"
      />

      <label className="flex items-center mt-4">
        <input
          type="checkbox"
          checked={keyBinding}
          onChange={() => setKeyBinding(!keyBinding)}
          className="mr-2"
        />
        <span>Require Key Binding (Holder's Public Key)</span>
      </label>
    </div>
  );
};

export default IssuerForm;
