"use client";

import { useState } from "react";

export default function AdminPage() {
  const [floor, setFloor] = useState("1.40");
  const target = Number(floor || 0) + 0.1;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-5xl font-black text-cyan-100">Harbor Command</h1>
      <div className="mt-8 rounded-3xl bg-white/10 p-8 backdrop-blur-xl">
        <label className="block">
          <span className="text-white/70">Jungle Bay Floor</span>
          <input value={floor} onChange={(e) => setFloor(e.target.value)} className="mt-2 w-full rounded-xl bg-black/30 p-4" />
        </label>
        <p className="mt-4 text-2xl font-black text-yellow-200">Target: {target.toFixed(2)} ETH</p>
        <button className="mt-6 rounded-xl bg-yellow-300 px-8 py-4 font-black text-slate-950">Create Round</button>
      </div>
    </main>
  );
}
