import { useState } from "react";
// import { SdJwtIssuer } from "../../sd-jwt/pkg/sdjwt_bg";
// import * as wasm from "../../sd-jwt/pkg/sdjwt_bg";
// import { SdJwtIssuer } from "../pkg";
// import("../../sd-jwt/pkg/sdjwt").then((module) => {
//   let sdjwt = new module.SdJwtIssuer("test", "test");
//   let encoded = sdjwt.encode();
// });
import * as wasm from "sdjwt";

interface IssuerFormProps {
  setSdJwt: (sdJwt: string) => void;
}

const private_key = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCU72wNWzLQool2
+VviuF4rKaCFJurXyMKY2CDOY3WP+99cEG9rTvDRBQq6bnkb3bUDmz+hncVHLJiP
+eQqOLMVNuJ0dEMrbkQ8gbEviB4TScmlpqDbQ+qJTx+3cqMTnX99StTJ4yTTaVdP
nId6rNOo3qwngl/DXuvCoQ1mregh1KQe8PaFsmlxmQ2SrPE/qnw0q6eM0CSRsEIg
p0zOU8tFgnaNbcQ3LXgpz1+cku7WzJV8S90Fxw1IKPRR/8xzeGtyzSRyKpVlNje6
8GlCg8bBnrpQnmb02MRrQi28Jdarh07rDhlRkU1WT71EL/tS6EvtNYXdD76sBCVJ
TmXhlnyVAgMBAAECggEAAxAb2152LUV0D3oejwtJn7IFQ7FcM3N4HqdhoInGsvjA
5czOVDLVNjpxt3A3YppTQBXv36wCxAb0kEMMYGeDT1SUoN58CMDSYggsxuFFKEWX
m9keBirGADlPWd95ErMys9BXj46LUfAg3cATWgBQTgqRfpjqZtzLez8Cq1gfDDfV
eMINKyxJHFABSSAX1NAfcJm/2vuBYN2oNNv+JdI1qlgL2onHFQmuOQl+H1SX2JEl
IY7H1ATA39PRg8dTSYBo42qQ8jDmvVzgLVXOaOtWZJvZL8RalZVkqAPY8NncxyGF
NlmzqfMCta6MCuxydB91ZXpAwuZnKuUz5CMPA9a4FQKBgQDGLlybTFckhXFZ0VXg
fEn51quOMkvlMrRgd8F4JMI79+pq0KHaSM0EpCjOv3NqAectGQmbMQB8LuISreso
ZuRyg2ScJSowbDu379ku/wOZpm5vSmBsfzHWas2jT1x4/6PYGnNMQKv1IkD9K4Eg
0ewejTv4avU+ZZW30HMmV0iHJwKBgQDAYwNyWp+hprD9lC02DA5yDAZRgzWBltt2
0NxyRXDV+CNZAfdn7xFPo6OcSzCeLVVglKjnJ4RCqFJJ6wjGsFz3ymXXql3bjvOY
yYlQxEBfkHMAJb7N6We/lD8GNWZTffFNbsOsWUla9XsbI8vhbF/VrFIrtkKt6vZZ
xJNiZQNT4wKBgQDAAlsm+6fScpeH9hHGFaV2sk40zvZJcf7hGCYSSUsG3wP3yXuH
CdHZFVOUPFmN85oPT5rHCYr2xlWy015rHoVnjXYE8t0VXUfexjseFWVfkKiemukh
NXsLyx7BgzqM4OHVloru7hmsvytIHsZVDg4+64eW/8nsUm/kT8nA9AAJMQKBgEBA
EQOczlkPMWbOmLbHGf/ukiGg3zqzJgItSKIFHOTopO1x4a1dQvvE27wzxD3fR/ck
TrA8G0ijrC+xhdHNTo8WkiKPbB8KQ8JP9EL797+ynyV6dZmRDKwHl3C8XrsdgXvp
tQGXJA9zkjSDJPDY37ydeyfMC8LHiJR8OPiQYacfAoGBAKu0smpwESWQ1NrRMji0
OUVLYDPyQqybgdYS6PAQiJYpKCCDNofCO676XqYC35ss4RweabgTL7VLsEL5Xz1x
pt/agClszuk33DxAk7uqRgbZzVo5PBMhxA1AA9Xc9aho4f8tavTZWf9ARjncmYZd
g/81VtrJi19YiFd+h0JnATsq
-----END PRIVATE KEY-----`;

const IssuerForm: React.FC<IssuerFormProps> = ({ setSdJwt }) => {
  const [yamlData, setYamlData] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<string>("RS256");

  const handleConstructJwt = async () => {
    console.log("SdJwtIssuer", wasm.SdJwtIssuer);
    const issuer = new wasm.SdJwtIssuer(yamlData, private_key);
    const jwt = issuer.encode();
    setSdJwt(jwt);
    console.log(jwt);
  };

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
        placeholder="Enter YAML Claims"
        className="w-full h-80 p-2 border border-gray-300 rounded"
      />
      <textarea
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        placeholder="Issuer Private Key (PEM format)"
        className="w-full mt-4 p-2 border border-gray-300 rounded h-28"
      />
      <textarea
        value={publicKey}
        onChange={(e) => setPublicKey(e.target.value)}
        placeholder="Holder Public Key (PEM format)"
        className="w-full mt-4 p-2 border border-gray-300 rounded h-28"
      />
      <button
        onClick={handleConstructJwt}
        className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Issue SD-JWT
      </button>
    </div>
  );
};

export default IssuerForm;
