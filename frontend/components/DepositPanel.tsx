"use client";

import { useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { raffleAbi, raffleAddress } from "@/lib/contract";

const quickAmounts = ["0.01", "0.05", "0.10", "0.50", "1"];

export default function DepositPanel() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("0.01");
  const [error, setError] = useState<string | null>(null);

  const isConfigured =
    raffleAddress !== "0x0000000000000000000000000000000000000000";

  const parsedAmount = useMemo(() => {
    try {
      if (!amount || Number(amount) <= 0) return undefined;
      return parseEther(amount);
    } catch {
      return undefined;
    }
  }, [amount]);

  const estimatedOdds = useMemo(() => {
    const n = Number(amount || 0);
    if (!n) return "0.00";
    return Math.min(n * 54.3, 99.99).toFixed(2);
  }, [amount]);

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function handleDeposit() {
    setError(null);

    if (!isConnected) {
      setError("Connect your wallet first.");
      return;
    }

    if (!isConfigured) {
      setError("Set NEXT_PUBLIC_RAFFLE_ADDRESS after deploying the contract.");
      return;
    }

    if (!parsedAmount) {
      setError("Enter a valid ETH amount.");
      return;
    }

    try {
      writeContract({
        address: raffleAddress,
        abi: raffleAbi,
        functionName: "deposit",
        value: parsedAmount
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deposit failed.");
    }
  }

  const disabled =
    !isConnected || !isConfigured || !parsedAmount || isPending || isConfirming;

  return (
    <section className="rounded-2xl border border-white/10 bg-[#10151c]/95 p-8 shadow-2xl">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_180px_1.2fr] lg:items-end">
        <div>
          <h2 className="text-3xl font-black text-cyan-100">
            🚤 Your Contribution
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Enter ETH to send your captain into the Jungle Bay race.
          </p>

          <label className="mt-6 block">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">
              Amount (ETH)
            </span>

            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
              placeholder="0.01"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-4 text-3xl font-black outline-none focus:border-lime-400"
            />
          </label>
        </div>

        <div className="rounded-xl border border-lime-400/40 bg-black/30 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-white/50">
            Your Odds
          </p>
          <p className="mt-2 text-3xl font-black text-lime-400">
            {estimatedOdds}%
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">
            Quick Amount
          </p>

          <div className="mt-2 grid grid-cols-5 gap-3">
            {quickAmounts.map((quick) => (
              <button
                key={quick}
                type="button"
                onClick={() => setAmount(quick)}
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm font-black text-white transition hover:border-lime-400 hover:text-lime-300"
              >
                {quick} ETH
              </button>
            ))}
          </div>

          <button
            onClick={handleDeposit}
            disabled={disabled}
            className="mt-4 w-full rounded-xl bg-lime-400 px-8 py-4 text-lg font-black text-black shadow-[0_0_30px_rgba(163,230,53,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending
              ? "Confirm In Wallet..."
              : isConfirming
              ? "Confirming..."
              : "LOAD TREASURE"}
          </button>
        </div>
      </div>

      <div className="mt-5 text-sm text-white/50">
        Weighted odds are based on your net contribution after contract rules.
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-500/20 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {hash && (
        <div className="mt-4 rounded-xl bg-black/20 p-4 text-sm">
          TX:{" "}
          <span className="font-mono text-cyan-100">
            {hash.slice(0, 10)}...{hash.slice(-8)}
          </span>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 rounded-xl bg-green-500/20 p-4 font-bold text-green-100">
          Deposit confirmed. Your captain is in the race.
        </div>
      )}

      {!isConfigured && (
        <p className="mt-4 text-center text-sm text-yellow-100">
          Demo mode active. Deploy contract and set NEXT_PUBLIC_RAFFLE_ADDRESS.
        </p>
      )}
    </section>
  );
}
