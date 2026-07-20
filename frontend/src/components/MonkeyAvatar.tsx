"use client";

import { useEffect, useState } from "react";

const MONKEY_TRAITS = {
  fur: ["🌴", "🍃", "🌻", "🦜", "🍌", "🥥", "🌺", "🪴"],
  hat: ["🎩", "👑", "🧢", " Pirate", "🪖", "🎓", "🧳", "-none"],
  boat: ["🛶", "🚤", "⛵", "🛥️", "🚢", "🏝️", "🪵", "🛸"],
  accessory: ["🔭", "🧭", "💎", "🔑", "📿", "🦴", "🐚", "⭐"],
};

const MONKEY_EMOJIS = ["🐵", "🐒", "🦍", "🦧"];

export function generateMonkey(walletAddress: string) {
  const hash = walletAddress.toLowerCase().replace("0x", "");
  
  const seed = (offset: number) => parseInt(hash.slice(offset, offset + 4), 16);
  
  const monkeyType = MONKEY_EMOJIS[seed(0) % MONKEY_EMOJIS.length];
  const fur = MONKEY_TRAITS.fur[seed(2) % MONKEY_TRAITS.fur.length];
  const hat = MONKEY_TRAITS.hat[seed(4) % MONKEY_TRAITS.hat.length];
  const boat = MONKEY_TRAITS.boat[seed(6) % MONKEY_TRAITS.boat.length];
  const accessory = MONKEY_TRAITS.accessory[seed(8) % MONKEY_TRAITS.accessory.length];
  
  const speed = 80 + (seed(10) % 120);
  const luck = 50 + (seed(12) % 100);
  const strength = 60 + (seed(14) % 80);
  
  const name = generateName(hash);
  
  return { monkeyType, fur, hat, boat, accessory, speed, luck, strength, name };
}

function generateName(hash: string): string {
  const prefixes = ["Jungle", "Bay", "Coco", "Banana", "Mango", "Tiki", "Kongo", "Bongo", "Tarzan", "George"];
  const suffixes = ["King", "Lord", "Chief", "Boss", "Sage", "Pilot", "Captain", "Hunter", "Scout", "Rebel"];
  
  const p = prefixes[parseInt(hash.slice(0, 2), 16) % prefixes.length];
  const s = suffixes[parseInt(hash.slice(2, 4), 16) % suffixes.length];
  
  return `${p} ${s}`;
}

export function MonkeyAvatar({ wallet, size = 120 }: { wallet: string; size?: number }) {
  const [monkey, setMonkey] = useState<ReturnType<typeof generateMonkey> | null>(null);
  
  useEffect(() => {
    if (wallet) {
      setMonkey(generateMonkey(wallet));
    }
  }, [wallet]);
  
  if (!monkey) {
    return <div className="monkey-avatar" style={{ width: size, height: size }}>🐵</div>;
  }
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="monkey-avatar relative" 
        style={{ width: size, height: size, fontSize: `${size * 0.025}rem` }}
      >
        <span style={{ fontSize: `${size * 0.5}px` }}>{monkey.monkeyType}</span>
        <div className="absolute -top-2 -right-2 text-2xl">{monkey.hat}</div>
        <div className="absolute -bottom-2 -right-2 text-xl">{monkey.accessory}</div>
      </div>
      <div className="text-center">
        <p className="font-bold text-jungle-300 glow-text">{monkey.name}</p>
        <p className="text-xs text-jungle-400">{monkey.boat} Speed: {monkey.speed} | Luck: {monkey.luck}</p>
      </div>
    </div>
  );
}