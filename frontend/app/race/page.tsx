export default function RacePage() {
  return (
    <main className="min-h-screen bg-[#05080d] px-6 py-10 text-white">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm font-black tracking-[0.4em] text-cyan-300">LIVE RACE</p>
        <h1 className="mt-3 text-5xl font-black md:text-7xl">JUNGLE BAY CUP</h1>

        <div className="mt-8 rounded-[32px] border border-white/10 bg-gradient-to-b from-sky-500 via-cyan-800 to-blue-950 p-10 shadow-2xl">
          <div className="rounded-3xl border border-white/15 bg-black/35 p-8 backdrop-blur-xl">
            <h2 className="text-3xl font-black text-cyan-100">No live racers yet</h2>
            <p className="mt-3 max-w-2xl text-white/65">
              Once the first round is created and users enter the raffle, this page will show live captains,
              contributions, weighted odds, and race progress.
            </p>
            <a href="/" className="mt-6 inline-block rounded-2xl bg-yellow-300 px-8 py-4 font-black text-black">
              ENTER THE RACE
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
