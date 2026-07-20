import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jungle Bay Raffle 🏹🐒🏝️",
  description: "Race your monkey to Jungle Bay Island. Burn tokens. Win NFTs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}