"use client";

import { useState, useEffect } from "react";

const POWER_UPS = [
  { type: "speed", name: "Speed Surge", emoji: "⚡", color: "power-speed", desc: "+25 base speed" },
  { type: "speed", name: "Turbo Boost", emoji: "🚀", color: "power-speed", desc: "+50 base speed" },
  { type: "speed", name: "Lightning", emoji: "⚡", color: "power-speed", desc: "+75 base speed" },
  { type: "shield", name: "Shield", emoji: "🛡️", color: "power-shield", desc: "Block 1 hazard" },
  { type: "shield", name: "Bubble Shield", emoji: "🫧", color: "power-shield", desc: "Block 2 hazards" },
  { type: "shortcut", name: "Shortcut", emoji: "🌊", color: "power-shortcut", desc: "Skip 10% of race" },
  { type: "shortcut", name: "Secret Path", emoji: "🧭", color: "power-shortcut", desc: "Skip 20% of race" },
  { type: "shortcut", name: "Tunnel", emoji: "🕳️", color: "power-shortcut", desc: "Skip 30% of race" },
];

type PackState = "idle" | "spinning" | "revealing" | "revealed";

export function PackSpinner({ onOpen, canOpen = true }: { onOpen?: () => void; canOpen?: boolean }) {
  const [state, setState] = useState<PackState>("idle");
  const [result, setResult] = useState<typeof POWER_UPS[0] | null>(null);
  const [spinningItems, setSpinningItems] = useState(POWER_UPS[0]);
  
  useEffect(() => {
    if (state === "spinning") {
      const interval = setInterval(() => {
        setSpinningItems(POWER_UPS[Math.floor(Math.random() * POWER_UPS.length)]);
      }, 80);
      
      const timeout = setTimeout(() => {
        clearInterval(interval);
        const random = POWER_UPS[Math.floor(Math.random() * POWER_UPS.length)];
        setResult(random);
        setState("revealing");
        setTimeout(() => setState("revealed"), 100);
      }, 3000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [state]);
  
  const handleOpen = () => {
    if (!canOpen || state === "spinning") return;
    setState("spinning");
    setResult(null);
    onOpen?.();
  };
  
  return (
    <div className="flex flex-col items-center gap-6">
      <h3 className="text-2xl font-bold text-sand-400 glow-gold">🌴 Power-Up Pack 🌴</h3>
      
      <div className={`relative w-64 h-64 rounded-3xl flex items-center justify-center transition-all duration-300 ${
        state === "spinning" ? "pack-shake pack-glow" : "pack-glow"
      }`} style={{
        background: "linear-gradient(145deg, #854d0e 0%, #a16207 50%, #713f12 100%)",
        border: "3px solid #fde047",
      }}>
        {state === "idle" && (
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">🎁</div>
            <p className="text-sand-200 font-bold">Mystery Pack</p>
            <p className="text-sand-400 text-sm">1000 JUNGLE tokens</p>
          </div>
        )}
        
        {state === "spinning" && (
          <div className="text-center">
            <div className="text-6xl mb-4 animate-spin-slow">{spinningItems.emoji}</div>
            <p className="text-sand-200 font-bold text-lg">{spinningItems.name}</p>
          </div>
        )}
        
        {(state === "revealing" || state === "revealed") && result && (
          <div className="text-center">
            <div className="text-7xl mb-4 animate-float">{result.emoji}</div>
            <p className="text-sand-200 font-bold text-xl">{result.name}</p>
            <p className="text-jungle-300 text-sm mt-2">{result.desc}</p>
            <span className={`power-up-badge ${result.color} mt-3`}>
              {result.type.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      {state === "idle" && (
        <button className="btn-gold" onClick={handleOpen} disabled={!canOpen}>
          Open Pack 🎁
        </button>
      )}
      
      {state === "spinning" && (
        <p className="text-sand-400 animate-pulse font-bold">Spinning... 🔮</p>
      )}
      
      {state === "revealed" && result && (
        <button className="btn-jungle" onClick={() => setState("idle")}>
          Open Another →
        </button>
      )}
      
      {!canOpen && state === "idle" && (
        <p className="text-red-400 text-sm">Need more JUNGLE tokens!</p>
      )}
    </div>
  );
}