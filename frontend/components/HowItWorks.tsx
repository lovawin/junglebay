const steps = [
  ["💰", "Contribute", "Send ETH to join. 3% platform fee applies."],
  ["🏁", "Race to Target", "The community pushes the pot to the finish line."],
  ["🏆", "One Winner", "A verifiable random winner is drawn."],
  ["🎁", "We Buy It", "The NFT is purchased and sent to the winner."]
];

export default function HowItWorks() {
  return (
    <section id="how" className="mt-8 rounded-2xl border border-white/10 bg-[#0b1119] p-6">
      <h2 className="text-center text-2xl font-black">HOW IT WORKS</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {steps.map(([icon, title, text]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="text-5xl">{icon}</div>
            <h3 className="mt-4 font-black text-lime-400">{title}</h3>
            <p className="mt-2 text-sm text-white/60">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
