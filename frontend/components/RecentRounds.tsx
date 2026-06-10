const rounds = [
  ["Round #3", "1.572 ETH", "WINNER: 0x8a7...4F2e"],
  ["Round #2", "0.932 ETH", "REFUNDED"]
];

export default function RecentRounds() {
  return (
    <section id="history" className="mt-8 rounded-2xl border border-white/10 bg-[#0b1119] p-6">
      <h2 className="text-2xl font-black">RECENT ROUNDS</h2>

      <div className="mt-5 space-y-3">
        {rounds.map(([round, eth, status]) => (
          <div key={round} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div>
              <p className="font-black">{round}</p>
              <p className="text-sm text-white/50">{eth} · Target: 1.500 ETH</p>
            </div>

            <span className="rounded-lg bg-lime-400/20 px-3 py-1 text-xs font-black text-lime-300">
              {status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
