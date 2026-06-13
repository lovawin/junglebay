"use client";

import { useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { formatEther, keccak256, parseEther, toHex } from "viem";
import artifact from "@/lib/abi/LetsBuyJungleBay.json";

const abi = artifact.abi;
const contractAddress = process.env.NEXT_PUBLIC_RAFFLE_CONTRACT as `0x${string}` | undefined;
const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();

const stateLabels = [
  "Open",
  "Target Reached",
  "Winner Selected",
  "Funds Withdrawn",
  "Delivered",
  "Refunds Open",
  "Cancelled",
  "Archived"
];

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const [floor, setFloor] = useState("1.40");
  const [secret, setSecret] = useState("");
  const [revealSecret, setRevealSecret] = useState("");
  const [status, setStatus] = useState("");

  const isAdmin = !!address && !!adminWallet && address.toLowerCase() === adminWallet;
  const isConfigured = !!contractAddress && contractAddress !== "0xPASTE_DEPLOYED_CONTRACT_HERE";

  const secretHash = useMemo(() => {
    if (!secret) return "";
    return keccak256(toHex(secret));
  }, [secret]);

  const { data: round } = useReadContract({
    address: contractAddress,
    abi,
    functionName: "currentRound",
    query: { enabled: isConfigured }
  });

  async function createRound() {
    if (!isConfigured) return setStatus("Contract address not configured yet.");
    if (!secret) return setStatus("Generate or enter a secret first.");

    setStatus("Creating round...");
    await writeContractAsync({
      address: contractAddress!,
      abi,
      functionName: "createRound",
      args: [parseEther(floor), secretHash]
    });
    setStatus("Create round transaction submitted.");
  }

  async function revealWinner() {
    if (!isConfigured) return setStatus("Contract address not configured yet.");
    if (!revealSecret) return setStatus("Enter the original secret.");

    setStatus("Revealing winner...");
    await writeContractAsync({
      address: contractAddress!,
      abi,
      functionName: "revealWinner",
      args: [revealSecret]
    });
    setStatus("Reveal winner transaction submitted.");
  }

  async function adminAction(functionName: string) {
    if (!isConfigured) return setStatus("Contract address not configured yet.");

    setStatus(`${functionName}...`);
    await writeContractAsync({
      address: contractAddress!,
      abi,
      functionName
    });
    setStatus(`${functionName} transaction submitted.`);
  }

  function generateSecret() {
    const value = `jungle-bay-${Date.now()}-${crypto.randomUUID()}`;
    setSecret(value);
    setStatus("Secret generated. Save it somewhere safe. You need it to reveal winner.");
  }

  const r = round as any;

  return (
    <main className="min-h-screen bg-[#05080d] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200/70">
              Admin Only
            </p>
            <h1 className="mt-2 text-5xl font-black text-cyan-100">
              Harbor Command
            </h1>
          </div>
          <ConnectButton />
        </div>

        {!isConnected && (
          <div className="mt-8 rounded-3xl border border-yellow-300/30 bg-yellow-300/10 p-6">
            Connect your admin wallet.
          </div>
        )}

        {isConnected && !isAdmin && (
          <div className="mt-8 rounded-3xl border border-red-400/30 bg-red-500/10 p-6">
            Access denied. This page is only visible to the admin wallet.
          </div>
        )}

        {isConnected && isAdmin && (
          <div className="mt-8 grid gap-6">
            {!isConfigured && (
              <div className="rounded-3xl border border-orange-300/30 bg-orange-300/10 p-6">
                Contract not configured yet. Set NEXT_PUBLIC_RAFFLE_CONTRACT after deployment.
              </div>
            )}

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-black">Current Round</h2>
              {r ? (
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <Stat label="Round" value={String(r.id ?? "0")} />
                  <Stat label="State" value={stateLabels[Number(r.state ?? 0)] ?? String(r.state)} />
                  <Stat label="Raised" value={`${formatEther(r.totalRaised ?? BigInt(0))} ETH`} />
                  <Stat label="Target" value={`${formatEther(r.targetAmount ?? BigInt(0))} ETH`} />
                </div>
              ) : (
                <p className="mt-4 text-white/60">No round data loaded.</p>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-black">Create Round</h2>

              <label className="mt-4 block">
                <span className="text-white/70">Jungle Bay floor price in ETH</span>
                <input
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-black/30 p-4 outline-none"
                />
              </label>

              <div className="mt-4 rounded-2xl bg-black/30 p-4">
                <p className="text-sm text-white/60">Secret</p>
                <p className="mt-1 break-all text-sm">{secret || "No secret generated yet."}</p>
                <p className="mt-3 text-sm text-white/60">Secret Hash</p>
                <p className="mt-1 break-all text-sm text-cyan-200">{secretHash || "—"}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={generateSecret} className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 font-black">
                  Generate Secret
                </button>
                <button disabled={isPending} onClick={createRound} className="rounded-xl bg-yellow-300 px-6 py-3 font-black text-slate-950 disabled:opacity-50">
                  Create Round
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-black">Winner / Funds</h2>

              <label className="mt-4 block">
                <span className="text-white/70">Original Secret</span>
                <input
                  value={revealSecret}
                  onChange={(e) => setRevealSecret(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-black/30 p-4 outline-none"
                />
              </label>

              <div className="mt-5 flex flex-wrap gap-3">
                <button disabled={isPending} onClick={revealWinner} className="rounded-xl bg-cyan-300 px-6 py-3 font-black text-slate-950 disabled:opacity-50">
                  Reveal Winner
                </button>
                <button disabled={isPending} onClick={() => adminAction("ownerWithdraw")} className="rounded-xl bg-lime-300 px-6 py-3 font-black text-slate-950 disabled:opacity-50">
                  Withdraw Funds
                </button>
                <button disabled={isPending} onClick={() => adminAction("withdrawFees")} className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 font-black disabled:opacity-50">
                  Withdraw Fees
                </button>
                <button disabled={isPending} onClick={() => adminAction("markDelivered")} className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 font-black disabled:opacity-50">
                  Mark Delivered
                </button>
                <button disabled={isPending} onClick={() => adminAction("archiveRound")} className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 font-black disabled:opacity-50">
                  Archive Round
                </button>
                <button disabled={isPending} onClick={() => adminAction("cancelRound")} className="rounded-xl border border-red-400/30 bg-red-500/10 px-6 py-3 font-black text-red-100 disabled:opacity-50">
                  Cancel Round
                </button>
              </div>
            </section>

            {status && (
              <div className="rounded-2xl border border-cyan-200/20 bg-cyan-200/10 p-4 text-cyan-100">
                {status}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/30 p-4">
      <p className="text-xs uppercase tracking-widest text-white/45">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
