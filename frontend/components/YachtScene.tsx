import Image from "next/image";

export default function YachtScene() {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl lg:min-h-[650px]">
      <Image
        src="/assets/yacht-hero.png"
        alt="Jungle Bay yacht scene"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/30" />

      <div className="absolute bottom-8 left-8 rounded-2xl border border-lime-400/30 bg-black/75 px-6 py-4 backdrop-blur-xl">
        <p className="text-xl font-black text-lime-400">
          Target Reached! 🎉
        </p>
        <p className="mt-1 text-sm text-white/70">
          Winner drawn when the round ends.
        </p>
      </div>
    </div>
  );
}
