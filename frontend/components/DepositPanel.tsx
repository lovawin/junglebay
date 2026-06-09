"use client";

import { useMemo, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { raffleAbi, raffleAddress } from "@/lib/contract";

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

  const disabled = !isConnected || !isConfigured || !parsedAmount || isPending || isConfirming;

  return (
    <section className="mt-8 rounded-3xl border border-cyan-200/20 bg-white/10 p-8 backdrop-blur-xl">
      <h2 className="text-3xl font-black text-cyan-100">🚤 Join The Fleet</h2>

      <p className="mt-2 text-white/70">
        Enter ETH to send your monkey captain into the Jungle Bay race.
      </p>

      <label className="mt-6 block">
        <span className="text-sm text-white/70">ETH Amount</span>
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          placeholder="0.01"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-2xl font-black outline-none focus:border-cyan-200"
        />
      </label>

      <div className="mt-4 rounded-2xl bg-black/20 p-4 text-sm text-white/70">
        Weighted odds are based on your net contribution after contract rules.
      </div>

      {error && (
        <div className="mt-4 rounded-2xl bg-red-500/20 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {hash && (
        <div className="mt-4 rounded-2xl bg-black/20 p-4 text-sm">
          TX:{" "}
          <span className="font-mono text-cyan-100">
            {hash.slice(0, 10)}...{hash.slice(-8)}
          </span>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 rounded-2xl bg-green-500/20 p-4 font-bold text-green-100">
          Deposit confirmed. Your captain is in the race.
        </div>
      )}

      <button
        onClick={handleDeposit}
        disabled={disabled}
        className="mt-6 w-full rounded-2xl bg-yellow-300 px-8 py-4 text-xl font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Confirm In Wallet..." : isConfirming ? "Confirming..." : "Load Treasure"}
      </button>

      {!isConfigured && (
        <p className="mt-4 text-center text-sm text-yellow-100">
          Demo mode active. Deploy contract and set NEXT_PUBLIC_RAFFLE_ADDRESS.
        </p>
      )}
    </section>
  );
}
