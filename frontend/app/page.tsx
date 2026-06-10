import DepositPanel from "@/components/DepositPanel";
import HowItWorks from "@/components/HowItWorks";
import PotDashboard from "@/components/PotDashboard";
import RecentRounds from "@/components/RecentRounds";
import YachtScene from "@/components/YachtScene";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05080d] text-white">
      <section className="mx-auto grid max-w-[1500px] gap-8 px-6 py-8 lg:grid-cols-[0.75fr_1.55fr]">
        <div className="py-6">
          <h1 className="text-5xl font-black leading-none md:text-7xl">
            LET&apos;S BUY A
            <span className="block text-lime-400">
              JUNGLE BAY
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-white/70">
            The community raffle to purchase a Jungle Bay Yacht NFT.
            One winner. Transparent. Verifiable. Onchain.
          </p>

          <div className="mt-6">
            <PotDashboard />
          </div>
        </div>

        <YachtScene />
      </section>

      <section id="enter" className="mx-auto max-w-[1500px] px-6">
        <DepositPanel />
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-8 px-6 pb-10 lg:grid-cols-2">
        <HowItWorks />
        <RecentRounds />
      </section>
    </main>
  );
}
