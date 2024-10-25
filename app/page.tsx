"use client"; // Ensure this page is client-side

import IssuerForm from "../components/IssuerForm";
import HolderForm from "../components/HolderForm";
import VerifierForm from "../components/VerifierForm";
import { useState } from "react";

export default function Home() {
  const [sdJwt, setSdJwt] = useState<string>("");
  const [holderSdJwt, setHolderSdJwt] = useState<string>("");
  const [issuerPublicKey, setIssuerPublicKey] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 text-left">
        <h1 className="text-2xl">SD-JWT</h1>
      </header>

      <main className="p-8">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          <IssuerForm
            setSdJwt={setSdJwt}
            setIssuerPublicKey={setIssuerPublicKey}
          />
          <HolderForm
            sdJwt={sdJwt}
            issuerPublicKey={issuerPublicKey}
            setHolderSdJwt={setHolderSdJwt}
          />
          <VerifierForm holderSdJwt={holderSdJwt} />
        </div>
      </main>
    </div>
  );
}
