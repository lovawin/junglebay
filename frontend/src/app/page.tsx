"use client";

import { useState, useEffect } from "react";
import { MonkeyAvatar } from "@/components/MonkeyAvatar";
import { PackSpinner } from "@/components/PackSpinner";
import { RaceTrack } from "@/components/RaceTrack";

const MOCK_WALLET = "0x7A3F2b8C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A";

interface Racer {
  address: string;
  monkey: string;
  boat: string;
  name: string;
  progress: number;
  speed: number;
  shields: number;
  shortcuts: number;
  tokensLocked: number;
  finished: boolean;
  finishTime?: number;
}

export default function Home() {
  const [wallet, setWallet] = useState<string>("");
  const [connected, setConnected] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [totalBurned, setTotalBurned] = useState(0);
  const [burnGoal] = useState(130000); // 0.13 ETH in token units
  const [racers, setRacers] = useState<Racer[]>([]);
  const [raceLive, setRaceLive] = useState(false);
  const [winner, setWinner] = useState<string>("");
  const [myShields, setMyShields] = useState(0);
  const [myShortcuts, setMyShortcuts] = useState(0);
  const [mySpeedBoost, setMySpeedBoost] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7 * 24 * 60 * 60); // 7 days

  const handleConnect = () => {
    setWallet(MOCK_WALLET);
    setConnected(true);
  };

  const handleDeposit = () => {
    const amt = parseInt(depositAmount) || 0;
    if (amt <= 0) return;
    setTotalBurned(b => b + amt);
    setDepositAmount("");
  };

  const handlePackOpen = () => {
    setMyShields(s => s + 1);
  };

  const startRace = () => {
    setRaceLive(true);
  };

  useEffect(() => {
    if (totalBurned >= burnGoal && !raceLive) {
      const mockRacers: Racer[] = [
        { address: MOCK_WALLET, monkey: "🐵", boat: "⛵", name: "Jungle King", progress: 0, speed: 120, shields: myShields, shortcuts: myShortcuts, tokensLocked: 5000, finished: false },
        { address: "0x1234", monkey: "🐒", boat: "🚤", name: "Bay Boss", progress: 0, speed: 100, shields: 0, shortcuts: 0, tokensLocked: 3000, finished: false },
        { address: "0x5678", monkey: "🦍", boat: "🛶", name: "Coco Chief", progress: 0, speed: 90, shields: 1, shortcuts: 0, tokensLocked: 2000, finished: false },
        { address: "0x9abc", monkey: "🦧", boat: "🚢", name: "Mango Lord", progress: 0, speed: 110, shields: 0, shortcuts: 1, tokensLocked: 4000, finished: false },
      ];
      setRacers(mockRacers);
    }
  }, [totalBurned, burnGoal, raceLive, myShields, myShortcuts]);

  const progress = Math.min((totalBurned / burnGoal) * 100, 100);
  const daysLeft = Math.floor(timeLeft / 86400);
  const hoursLeft = Math.floor((timeLeft % 86400) / 3600);

  return (
    <div className="ocean-bg min-h-screen text-white">
      <nav className="flex items-center justify-between p-6 border-b border-jungle-700/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏹</span>
          <span className="text-xl font-bold text-jungle-300 glow-text">Jungle Bay Raffle</span>
          <span className="text-xs text-sand-400 border border-sand-600 rounded-full px-2 py-0.5">BETA</span>
        </div>
        {connected ? (
          <div className="flex items-center gap-4">
            <MonkeyAvatar wallet={wallet} size={48} />
            <span className="text-sm text-jungle-400">{wallet.slice(0,6)}...{wallet.slice(-4)}</span>
          </div>
        ) : (
          <button className="btn-jungle" onClick={handleConnect}>Connect Wallet</button>
        )}
      </nav>

      <section className="text-center py-16 px-4">
        <div className="text-6xl mb-4 animate-float">🏝️🐒⛵</div>
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-jungle-300 glow-text">Race to </span>
          <span className="text-sand-400 glow-gold">Jungle Bay</span>
        </h1>
        <p className="text-lg text-jungle-200 max-w-2xl mx-auto mb-8">
          Deposit JUNGLE tokens. Spin power-up packs. Race your monkey to the island.
          Burn tokens to win the Jungle Bay NFT. Don't make it? Get your tokens back minus 2%.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <div className="card-jungle text-center">
            <p className="text-sand-400 text-3xl font-bold glow-gold">{progress.toFixed(1)}%</p>
            <p className="text-sm text-jungle-400">Burn Progress</p>
          </div>
          <div className="card-jungle text-center">
            <p className="text-bay-300 text-3xl font-bold">{daysLeft}d {hoursLeft}h</p>
            <p className="text-sm text-jungle-400">Time Left</p>
          </div>
          <div className="card-jungle text-center">
            <p className="text-jungle-300 text-3xl font-bold glow-text">{racers.length || 0}</p>
            <p className="text-sm text-jungle-400">Racers</p>
          </div>
        </div>
      </section>

      {connected && (
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="card-jungle mb-8">
            <h2 className="text-2xl font-bold text-jungle-300 mb-4">🎯 Your Monkey</h2>
            <div className="flex justify-center">
              <MonkeyAvatar wallet={wallet} size={140} />
            </div>
          </div>

          <div className="card-jungle mb-8">
            <h2 className="text-2xl font-bold text-sand-400 glow-gold mb-4">🔥 Burn Pool</h2>
            <div className="progress-bar mb-4" style={{ height: "16px" }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-sm mb-6">
              <span className="text-jungle-300">{totalBurned.toLocaleString()} JNG burned</span>
              <span className="text-sand-400">Goal: {burnGoal.toLocaleString()} JNG</span>
            </div>
            
            <div className="flex gap-4">
              <input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                placeholder="Amount of JNG tokens"
                className="flex-1 bg-jungle-950 border border-jungle-700 rounded-xl px-4 py-3 text-white outline-none focus:border-jungle-400"
              />
              <button className="btn-gold" onClick={handleDeposit}>Deposit & Race 🏁</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card-jungle flex flex-col items-center">
              <PackSpinner onOpen={handlePackOpen} canOpen={true} />
              <div className="mt-4 flex gap-2">
                <span className="power-up-badge power-shield">🛡️ {myShields}</span>
                <span className="power-up-badge power-shortcut">🌊 {myShortcuts}</span>
                <span className="power-up-badge power-speed">⚡ {mySpeedBoost}</span>
              </div>
            </div>

            <div className="card-jungle">
              <h3 className="text-xl font-bold text-bay-300 mb-4">📜 How It Works</h3>
              <ol className="space-y-3 text-sm text-jungle-200">
                <li className="flex gap-2"><span className="text-sand-400 font-bold">1.</span> Connect wallet & deposit JUNGLE tokens</li>
                <li className="flex gap-2"><span className="text-sand-400 font-bold">2.</span> Your monkey & boat are generated from your wallet</li>
                <li className="flex gap-2"><span className="text-sand-400 font-bold">3.</span> Buy power-up packs to boost your race stats</li>
                <li className="flex gap-2"><span className="text-sand-400 font-bold">4.</span> When burn goal is hit, the race begins on-chain</li>
                <li className="flex gap-2"><span className="text-sand-400 font-bold">5.</span> First monkey to Jungle Bay wins the NFT 🏆</li>
                <li className="flex gap-2"><span className="text-sand-400 font-bold">6.</span> Goal not met? Withdraw tokens back (-2% fee)</li>
              </ol>
            </div>
          </div>

          {racers.length > 0 && (
            <div className="mb-8">
              <RaceTrack racers={racers} isLive={raceLive} winner={winner} />
              {!raceLive && (
                <div className="text-center mt-4">
                  <button className="btn-gold" onClick={startRace}>🏁 Start Race</button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {!connected && (
        <section className="max-w-2xl mx-auto px-4 pb-16">
          <div className="card-jungle text-center">
            <div className="text-5xl mb-4">🐒🛶🏝️</div>
            <p className="text-jungle-200 mb-6">
              Connect your wallet to generate your unique monkey and boat, 
              deposit JUNGLE tokens to enter the raffle, and race for the Jungle Bay NFT.
            </p>
            <button className="btn-gold text-lg" onClick={handleConnect}>
              🚀 Start Your Journey
            </button>
          </div>
        </section>
      )}

      <footer className="text-center py-8 border-t border-jungle-700/30 text-sm text-jungle-600">
        <p>🏹 Jungle Bay Raffle — Robin Hood Chain</p>
        <p className="mt-1">Not financial advice. Monkeys may or may not reach the island.</p>
      </footer>
    </div>
  );
}