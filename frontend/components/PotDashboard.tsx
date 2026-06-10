import Link from "next/link";
import RoundStats from "@/components/RoundStats";

export default function PotDashboard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d121a]/90 p-5 shadow-2xl">
      <RoundStats />

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">
            Participants
          </p>
          <p className="mt-1 text-2xl font-black">42</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">
            Time Remaining
          </p>
          <p className="mt-1 text-2xl font-black">1d 14h 32m</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href="#enter"
          className="rounded-xl bg-lime-400 px-5 py-4 text-center font-black text-black"
        >
          ENTER RAFFLE
        </a>

        <Link
          href="/race"
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center font-black"
        >
          VIEW RACE 🏁
        </Link>
      </div>
    </div>
  );
}
