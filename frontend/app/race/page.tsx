const racers = [
  { name:"Captain Gold Fur", wallet:"0x8a7F...4F2e", odds:24.3, contribution:"0.42 ETH", image:"/monkeys/monkey-01.png" },
  { name:"Captain Laser Eyes", wallet:"0x19cD...91aB", odds:18.7, contribution:"0.31 ETH", image:"/monkeys/monkey-02.png" },
  { name:"Captain Diamond", wallet:"0x772A...003d", odds:13.5, contribution:"0.22 ETH", image:"/monkeys/monkey-03.png" },
  { name:"Captain Pirate Ape", wallet:"0x6F10...C88a", odds:9.8, contribution:"0.16 ETH", image:"/monkeys/monkey-04.png" },
  { name:"Captain Neon Wake", wallet:"0x0A82...F912", odds:7.1, contribution:"0.11 ETH", image:"/monkeys/monkey-05.png" }
];

export default function RacePage() {
  const sorted = [...racers].sort((a,b)=>b.odds-a.odds);

  return (
    <main className="min-h-screen bg-[#05080d] px-6 py-10 text-white">
      <section className="mx-auto max-w-[1600px]">

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.4em] text-lime-400">
              LIVE RACE
            </p>

            <h1 className="mt-3 text-7xl font-black">
              THE JUNGLE BAY RACE
            </h1>
          </div>

          <div className="rounded-3xl border border-lime-400/20 bg-lime-400/10 p-6">
            <div className="text-xs uppercase text-white/40">
              Round Progress
            </div>
            <div className="text-5xl font-black text-lime-400">
              68%
            </div>
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#124b75] via-[#0c5d79] to-[#02131f]">

          <div className="absolute left-10 top-10 rounded-full bg-black/60 px-5 py-3 font-black">
            START
          </div>

          <div className="absolute right-10 top-10 rounded-full bg-yellow-300 px-5 py-3 font-black text-black">
            FINISH
          </div>

          <div className="absolute right-8 top-28 text-8xl">
            🏝️
          </div>

          <div className="relative h-[700px]">

            {racers.map((racer,index)=>{

              const distance = Math.min(15 + racer.odds * 2.5, 85);

              return (
                <div
                  key={racer.wallet}
                  className="absolute left-0 right-0"
                  style={{top:`${120 + index*110}px`}}
                >
                  <div className="absolute left-10 right-10 top-16 h-[2px] bg-white/15"/>

                  <div
                    className="absolute"
                    style={{
                      left:`${distance}%`,
                      animation:`float${index} 3s ease-in-out infinite`
                    }}
                  >
                    <div className="flex items-center gap-4">

                      <img
                        src={racer.image}
                        alt={racer.name}
                        className="h-20 w-20 rounded-2xl border border-white/20 object-cover shadow-xl"
                      />

                      <div className="relative text-[90px] leading-none">
                        🛥️

                        {index===0 && (
                          <div className="absolute -inset-2 rounded-full bg-yellow-300/20 blur-xl"/>
                        )}
                      </div>

                      <div className="w-72 rounded-2xl border border-white/10 bg-black/65 p-4 backdrop-blur-xl">
                        <div className="font-black text-lime-300">
                          {racer.name}
                        </div>

                        <div className="mt-1 font-mono text-xs text-white/40">
                          {racer.wallet}
                        </div>

                        <div className="mt-3 flex justify-between">
                          <span>{racer.contribution}</span>
                          <span className="font-black text-yellow-200">
                            {racer.odds}%
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          <div className="rounded-3xl border border-white/10 bg-[#0b1119] p-6">
            <h2 className="text-3xl font-black">
              Leaderboard
            </h2>

            <div className="mt-5 space-y-3">

              {sorted.map((racer,index)=>(
                <div
                  key={racer.wallet}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 text-center text-2xl font-black text-lime-400">
                      #{index+1}
                    </div>

                    <img
                      src={racer.image}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover"
                    />

                    <div>
                      <div className="font-black">
                        {racer.name}
                      </div>

                      <div className="font-mono text-xs text-white/40">
                        {racer.wallet}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-yellow-200">
                      {racer.odds}%
                    </div>

                    <div className="text-xs text-white/40">
                      {racer.contribution}
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

          <div className="rounded-3xl border border-lime-400/20 bg-lime-400/10 p-6">
            <h2 className="text-3xl font-black text-lime-300">
              Race Rules
            </h2>

            <div className="mt-5 space-y-4 text-white/70">
              <p>Higher contribution = better odds.</p>
              <p>Higher odds = further race position.</p>
              <p>Winner selected from weighted draw.</p>
            </div>

            <a
              href="/"
              className="mt-6 block rounded-2xl bg-lime-400 py-4 text-center text-lg font-black text-black"
            >
              ENTER THE RACE
            </a>
          </div>

        </div>
      </section>

      <style>{`
      @keyframes float0 {0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      @keyframes float1 {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes float2 {0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
      @keyframes float3 {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes float4 {0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
      `}</style>
    </main>
  );
}
