"use client"; // Ensure this page is client-side

import IssuerForm from "./components/IssuerForm";
import HolderForm from "./components/HolderForm";
import VerifierForm from "./components/VerifierForm";
import { useState } from "react";

export default function Home() {
  const [sdJwt, setSdJwt] = useState<string>("");
  const [holderSdJwt, setHolderSdJwt] = useState<string>("");
  const [issuerPublicKey, setIssuerPublicKey] = useState<string>("");
  const [kbKey, setKbKey] = useState<string>("");
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 text-left">
        <h1 className="text-2xl">SD-JWT</h1>
      </header>

      {showBanner && (
        <div className="bg-blue-100 text-blue-800 p-4 mx-4 mt-4 rounded-lg shadow-lg flex justify-between items-center">
          <div className="max-w-2xl">
            <p className="font-semibold">
              Welcome to the SD-JWT Learning and Debugging Website.
            </p>
            <p className="text-sm">
              This website is an open-source tool for learning, testing, and
              debugging Selective Disclosure JWTs (SD-JWTs). View the code or
              contribute on{" "}
              <a
                href="https://github.com/robjsliwa/sdjwt-web"
                className="underline text-blue-600 hover:text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-blue-800 hover:text-blue-900 focus:outline-none"
          >
            ✕
          </button>
        </div>
      )}

      <main className="p-8">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          <IssuerForm
            setSdJwt={setSdJwt}
            setIssuerPublicKey={setIssuerPublicKey}
            kbKey={kbKey}
          />
          <HolderForm
            sdJwt={sdJwt}
            issuerPublicKey={issuerPublicKey}
            setHolderSdJwt={setHolderSdJwt}
            setKbKey={setKbKey}
          />
          <VerifierForm
            holderSdJwt={holderSdJwt}
            issuerPublicKey={issuerPublicKey}
          />
        </div>
      </main>
    </div>
  );
}
