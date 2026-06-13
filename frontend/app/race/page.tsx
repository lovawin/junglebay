const racers = [
  { name: "Captain Gold Fur", wallet: "0x8a7F...4F2e", odds: 24.3, contribution: "0.42 ETH" },
  { name: "Captain Laser Eyes", wallet: "0x19cD...91aB", odds: 18.7, contribution: "0.31 ETH" },
  { name: "Captain Diamond", wallet: "0x772A...003d", odds: 13.5, contribution: "0.22 ETH" },
  { name: "Captain Pirate Ape", wallet: "0x6F10...C88a", odds: 9.8, contribution: "0.16 ETH" },
  { name: "Captain Neon Wake", wallet: "0x0A82...F912", odds: 7.1, contribution: "0.11 ETH" }
];

export default function RacePage() {
  const sorted = [...racers].sort((a, b) => b.odds - a.odds);

  return (
    <main className="min-h-screen bg-[#05080d] px-6 py-10 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-black tracking-[0.4em] text-cyan-300">LIVE RACE</p>
            <h1 className="mt-3 text-5xl font-black md:text-7xl">JUNGLE BAY CUP</h1>
          </div>

          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6">
            <div className="text-xs uppercase text-white/50">Round Progress</div>
            <div className="text-5xl font-black text-cyan-200">68%</div>
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-sky-400 via-cyan-700 to-blue-950 p-6 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(255,229,120,.8),transparent_12%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.12)_0_2px,transparent_2px_22px)] opacity-50" />

          <div className="relative z-10 flex justify-between">
            <span className="rounded-full bg-black/50 px-5 py-3 text-sm font-black">START</span>
            <span className="rounded-full bg-yellow-300 px-5 py-3 text-sm font-black text-black">FINISH 🏝️</span>
          </div>

          <div className="relative z-10 mt-10 space-y-5">
            {racers.map((racer, index) => {
              const distance = Math.min(12 + racer.odds * 2.7, 82);

              return (
                <div key={racer.wallet} className="relative h-24 rounded-2xl border border-white/10 bg-white/5">
                  <div className="absolute left-5 right-5 top-1/2 h-[2px] bg-white/15" />

                  <div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${distance}%` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-6xl drop-shadow-xl">🛥️</div>
                      <div className="hidden rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-xl md:block">
                        <div className="font-black text-cyan-100">{racer.name}</div>
                        <div className="font-mono text-xs text-white/45">{racer.wallet}</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-4 top-4 text-sm font-black text-white/70">
                    #{index + 1}
                  </div>

                  <div className="absolute bottom-3 left-4 text-xs text-white/45">
                    {racer.contribution}
                  </div>

                  <div className="absolute bottom-3 right-4 font-black text-yellow-200">
                    {racer.odds}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-[#0b1119] p-6">
            <h2 className="text-3xl font-black">Leaderboard</h2>

            <div className="mt-5 space-y-3">
              {sorted.map((racer, index) => (
                <div key={racer.wallet} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div>
                    <div className="font-black">
                      <span className="mr-3 text-cyan-300">#{index + 1}</span>
                      {racer.name}
                    </div>
                    <div className="font-mono text-xs text-white/40">{racer.wallet}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-yellow-200">{racer.odds}%</div>
                    <div className="text-xs text-white/40">{racer.contribution}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-6">
            <h2 className="text-3xl font-black text-cyan-200">Race Rules</h2>
            <div className="mt-5 space-y-4 text-white/70">
              <p>Every deposit gets weighted entries after the 3% fee.</p>
              <p>Higher contribution means stronger odds.</p>
              <p>Winner is selected by commit/reveal randomness.</p>
            </div>

            <a href="/" className="mt-6 block rounded-2xl bg-yellow-300 py-4 text-center text-lg font-black text-black">
              ENTER THE RACE
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
