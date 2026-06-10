"use client";

import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { raffleAbi, raffleAddress } from "@/lib/contract";

type RoundTuple = readonly [
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  `0x${string}`,
  `0x${string}`,
  boolean,
  boolean,
  boolean,
  number
];

export default function RoundStats() {
  const isConfigured =
    raffleAddress !== "0x0000000000000000000000000000000000000000";

  const { data: pot } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "currentPot",
    query: { enabled: isConfigured }
  });

  const { data: round } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "currentRound",
    query: { enabled: isConfigured }
  });

  const potEth = pot ? Number(formatEther(pot as bigint)) : 1.02;
  let targetEth = 1.5;

  if (round && Array.isArray(round)) {
    const typedRound = round as unknown as RoundTuple;
    targetEth = Number(formatEther(typedRound[2]));
  }

  const progress =
    targetEth > 0 ? Math.min((potEth / targetEth) * 100, 100) : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-lime-300">
            Current Pot
          </p>

          <h2 className="mt-2 text-5xl font-black tracking-tight text-white">
            {potEth.toFixed(3)}
            <span className="ml-2 text-2xl text-white/80">ETH</span>
          </h2>
        </div>

        <div className="rounded-2xl border border-lime-400/20 bg-lime-400/10 p-3 text-4xl">
          💰
        </div>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-lime-400 shadow-[0_0_25px_rgba(163,230,53,0.55)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between text-sm">
        <span className="font-black text-lime-300">
          {progress.toFixed(1)}% of target
        </span>
        <span className="text-white/60">
          Target: {targetEth.toFixed(3)} ETH
        </span>
      </div>

      {!isConfigured && (
        <p className="mt-4 text-xs text-white/40">
          Demo mode: set NEXT_PUBLIC_RAFFLE_ADDRESS after deployment.
        </p>
      )}
    </div>
  );
}
