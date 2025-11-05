// src/pages/KycPage.jsx
import { useState } from "react";
import { submitKyc } from "../api/kyc";

export default function KycPage({ token }) {
  const [aadhaar, setAadhaar] = useState("");
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [msg, setMsg] = useState("");

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4 text-white">KYC Verification</h1>
      <label className="block text-gray-200 mb-2">Aadhaar number</label>
      <input className="w-full mb-4 p-2 rounded bg-black/40 text-white"
        value={aadhaar} onChange={e=>setAadhaar(e.target.value.replace(/\D/g,''))} maxLength={12} />
      <label className="block text-gray-200 mb-2">Aadhaar front</label>
      <input type="file" accept="image/*" className="mb-4" onChange={e=>setFront(e.target.files?.[0]||null)} />
      <label className="block text-gray-200 mb-2">Aadhaar back</label>
      <input type="file" accept="image/*" className="mb-6" onChange={e=>setBack(e.target.files?.[0]||null)} />
      <button className="px-4 py-2 rounded bg-green-600 text-white"
        onClick={async ()=>{
          try{
            await submitKyc({ token, aadhaar, frontFile: front, backFile: back });
            setMsg("Submitted. Waiting for approval.");
          }catch(e){ setMsg(e.message); }
        }}
        disabled={!aadhaar || aadhaar.length!==12 || !front || !back}
      >Submit</button>
      {msg && <p className="mt-3 text-gray-200">{msg}</p>}
    </div>
  );
}
