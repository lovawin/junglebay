import Link from "next/link";
import DepositPanel from "@/components/DepositPanel";
import RoundStats from "@/components/RoundStats";

export default function YachtHero() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06182f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,192,120,0.35),transparent_25%),linear-gradient(180deg,#123e70_0%,#0b2447_45%,#06182f_100%)]" />

      <div className="absolute left-0 right-0 top-24 h-40 bg-cyan-300/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-72 bg-cyan-500/20 blur-2xl" />

      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-cyan-200/30 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-xl">
            🏝️ COMMUNITY RAFFLE · BASE MAINNET
          </div>

          <h1 className="text-6xl font-black leading-none tracking-tight md:text-7xl">
            LET&apos;S BUY A
            <span className="block bg-gradient-to-r from-yellow-200 via-cyan-200 to-white bg-clip-text text-transparent">
              JUNGLE BAY
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-cyan-50/80">
            Join the fleet, fill the pot, race across the ocean, and win the Jungle Bay NFT.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#enter" className="rounded-2xl bg-yellow-300 px-8 py-4 font-black text-slate-950 shadow-xl shadow-yellow-300/20">
              Enter Raffle
            </a>

            <Link href="/race" className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-black backdrop-blur-xl">
              View Race
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Stat label="Current Mission" value="Buy Jungle Bay" />
            <Stat label="Round Length" value="3 Days" />
            <Stat label="Odds" value="Weighted" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-gradient-to-b from-sky-300 to-cyan-700 p-6">
              <div className="text-right text-7xl">🏝️</div>

              <div className="mt-10 flex items-end justify-center gap-6">
                <div className="animate-bounce text-7xl">🚤</div>
                <div className="text-9xl drop-shadow-2xl">🛥️</div>
                <div className="animate-bounce text-7xl [animation-delay:500ms]">🚤</div>
              </div>

              <div className="mt-8 h-10 rounded-full bg-white/20">
                <div className="h-full w-2/3 rounded-full bg-white/40" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <Mini label="Pot" value="Live" />
              <Mini label="Target" value="+0.1 ETH" />
              <Mini label="Winner" value="Random" />
            </div>
          </div>
        </div>
      </section>

      <section id="enter" className="relative mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-2">
        <RoundStats />
        <DepositPanel />
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-widest text-cyan-100/70">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/20 p-3">
      <p className="text-xs text-white/60">{label}</p>
      <p className="font-black text-yellow-200">{value}</p>
    </div>
  );
}
