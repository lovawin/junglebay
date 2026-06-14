"use client";

import Link from "next/link";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";
import { raffleAbi, raffleAddress } from "@/lib/contract";

const zero = "0x0000000000000000000000000000000000000000";

export default function PotDashboard() {
  const isConfigured = raffleAddress !== zero;

  const { data: round } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "currentRound",
    query: { enabled: isConfigured }
  });

  const r = round as any;
  const roundId = Number(r?.id || 0);

  const { data: participantCount } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "participantCount",
    args: [BigInt(roundId)],
    query: { enabled: isConfigured && roundId > 0 }
  });

  const { data: timeRemaining } = useReadContract({
    address: raffleAddress,
    abi: raffleAbi,
    functionName: "timeRemaining",
    args: [BigInt(roundId)],
    query: { enabled: isConfigured && roundId > 0 }
  });

  const raised = r?.totalRaised ? Number(formatEther(r.totalRaised)) : 0;
  const target = r?.targetAmount ? Number(formatEther(r.targetAmount)) : 0;
  const progress = target > 0 ? Math.min((raised / target) * 100, 100) : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d121a]/90 p-5 shadow-2xl">
      <p className="text-xs uppercase tracking-widest text-white/40">Live round</p>
      <p className="mt-1 text-3xl font-black text-cyan-100">
        {roundId > 0 ? `Round #${roundId}` : "No round yet"}
      </p>

      <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-lime-400" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
        <Stat label="Raised" value={`${raised.toFixed(4)} ETH`} />
        <Stat label="Target" value={`${target.toFixed(4)} ETH`} />
        <Stat label="Participants" value={String(participantCount ?? 0)} />
        <Stat label="Time Left" value={formatTime(Number(timeRemaining ?? 0))} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <a href="#enter" className="rounded-xl bg-lime-400 px-5 py-4 text-center font-black text-black">
          ENTER RAFFLE
        </a>

        <Link href="/race" className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center font-black">
          VIEW RACE 🏁
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!seconds) return "0s";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
