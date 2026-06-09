import "./globals.css";
import Providers from "@/components/Providers";
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";

export const metadata = {
  title: "Let's Buy a Jungle Bay",
  description: "Monkey captains race to win a Jungle Bay NFT."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-cyan-500 via-blue-800 to-slate-950 text-white">
        <Providers>
          <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="font-black">
              🏝️ Monkey Harbor
            </Link>

            <nav className="hidden items-center gap-5 text-sm md:flex">
              <Link href="/">Harbor</Link>
              <Link href="/race">Race</Link>
              <Link href="/admin">Admin</Link>
            </nav>

            <ConnectWallet />
          </header>

          {children}
        </Providers>
      </body>
    </html>
  );
}
