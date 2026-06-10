import "./globals.css";
import Providers from "@/components/Providers";
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";

export const metadata = {
  title: "Let's Buy a Jungle Bay",
  description: "Community raffle to buy a Jungle Bay NFT."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="relative z-50 border-b border-white/10 bg-black">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">
              <Link href="/" className="leading-none">
                <div className="text-xs font-black">🌴 LET&apos;S BUY A</div>
                <div className="text-2xl font-black text-lime-400">JUNGLE BAY</div>
              </Link>

              <nav className="hidden items-center gap-8 text-sm md:flex">
                <Link href="/">Home</Link>
                <Link href="/race">Race 🏁</Link>
                <Link href="#history">History</Link>
                <Link href="#how">How It Works</Link>
                <Link href="/admin">Admin</Link>
              </nav>

              <ConnectWallet />
            </div>
          </header>

          {children}
        </Providers>
      </body>
    </html>
  );
}
