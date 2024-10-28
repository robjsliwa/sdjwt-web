export async function generateRSAPSSKeyPair(hashName: string): Promise<{
  publicKey: string;
  privateKey: string;
}> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-PSS",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: hashName },
    },
    true,
    ["sign", "verify"]
  );

  const publicKey = await exportKeyToPEM(keyPair.publicKey, "public");
  const privateKey = await exportKeyToPEM(keyPair.privateKey, "private");

  return { publicKey, privateKey };
}

export async function generateECDSAKeyPair(
  curveName: string
): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: curveName,
    },
    true,
    ["sign", "verify"]
  );

  const publicKey = await exportKeyToPEM(keyPair.publicKey, "public");
  const privateKey = await exportKeyToPEM(keyPair.privateKey, "private");

  return { publicKey, privateKey };
}

async function exportKeyToPEM(
  key: CryptoKey,
  type: "public" | "private"
): Promise<string> {
  let exported: ArrayBuffer;
  if (type === "public") {
    exported = await window.crypto.subtle.exportKey("spki", key);
  } else {
    exported = await window.crypto.subtle.exportKey("pkcs8", key);
  }

  const exportedAsBase64 = window.btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(exported)))
  );

  const pemExported = `-----BEGIN ${type.toUpperCase()} KEY-----\n${exportedAsBase64}\n-----END ${type.toUpperCase()} KEY-----`;

  return pemExported;
}
