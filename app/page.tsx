"use client"; // Ensure this page is client-side

import IssuerForm from "../components/IssuerForm";
import HolderForm from "../components/HolderForm";
import VerifierForm from "../components/VerifierForm";
import { useState } from "react";

export default function Home() {
  const [sdJwt, setSdJwt] = useState<string>("");
  const [holderSdJwt, setHolderSdJwt] = useState<string>("");
  // const [wasm, setWasm] = useState(null);

  // useEffect(() => {
  //   // Load the WASM module dynamically
  //   const loadWasm = async () => {
  //     try {
  //       // const wasmModule = await import("../pkg/sdjwt_bg"); // Import the WASM module
  //       setWasm(wasmModule);
  //     } catch (err) {
  //       console.error("Error loading WASM module:", err);
  //     }
  //   };

  //   loadWasm();
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 text-left">
        <h1 className="text-2xl">SD-JWT</h1>
      </header>

      <main className="p-8">
        {/* Use grid layout to display all three forms side by side */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          <IssuerForm setSdJwt={setSdJwt} />
          <HolderForm sdJwt={sdJwt} setHolderSdJwt={setHolderSdJwt} />
          <VerifierForm holderSdJwt={holderSdJwt} />
        </div>
      </main>
    </div>
  );
}
