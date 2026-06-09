import { mockRacers } from "@/lib/mockData";

export default function RacePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-5xl font-black text-cyan-100">Race To The Island</h1>
      <div className="relative mt-8 h-[560px] overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 via-cyan-600 to-blue-950">
        <div className="absolute right-8 top-0 bottom-0 flex w-32 items-center justify-center rounded-l-full bg-yellow-300/90 text-6xl">🏝️</div>
        {mockRacers.map((racer, i) => (
          <div key={racer.wallet} className="absolute text-5xl" style={{ top: 90 + i * 120, left: `${10 + racer.odds * 2}%` }}>
            🚤🐵
            <div className="rounded-xl bg-black/60 px-3 py-2 text-xs">
              {racer.wallet.slice(0, 6)}...{racer.wallet.slice(-4)} · {racer.odds}% odds
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
