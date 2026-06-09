import Link from "next/link";
import DepositPanel from "@/components/DepositPanel";
import RoundStats from "@/components/RoundStats";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="text-center">
        <div className="text-8xl">🏝️</div>

        <h1 className="mt-6 text-6xl font-black">
          LET&apos;S BUY A JUNGLE BAY
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-xl text-white/80">
          Join the fleet, fill the treasure chest, race to the island,
          and win a Jungle Bay NFT.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/race"
            className="rounded-2xl bg-yellow-300 px-8 py-4 font-black text-slate-950"
          >
            Enter Race
          </Link>

          <Link
            href="/admin"
            className="rounded-2xl bg-white/10 px-8 py-4 font-black"
          >
            Admin
          </Link>
        </div>
      </section>

      <RoundStats />
      <DepositPanel />
    </main>
  );
}
