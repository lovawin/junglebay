"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectWallet() {
  return (
    <ConnectButton
      accountStatus="avatar"
      chainStatus="icon"
      showBalance={false}
    />
  );
}
