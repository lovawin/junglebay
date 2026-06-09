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
    <section className="mt-12 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
      <h2 className="text-3xl font-black text-yellow-200">
        💰 Treasure Chest
      </h2>

      <div className="mt-6 h-8 overflow-hidden rounded-full bg-black/30">
        <div
          className="h-full bg-yellow-300 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 text-2xl font-black">
        {potEth.toFixed(4)} ETH / {targetEth.toFixed(4)} ETH
      </p>

      {!isConfigured && (
        <p className="mt-3 text-sm text-white/60">
          Demo mode: set NEXT_PUBLIC_RAFFLE_ADDRESS after deployment.
        </p>
      )}
    </section>
  );
}
