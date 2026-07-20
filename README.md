# 🏹 Jungle Bay — Gamified Token Raffle

The first gamified token raffle on Robinhood Chain. Deposit tokens, spin power-up packs, race your monkey to Jungle Bay Island, and burn tokens to win NFTs.

## How It Works

1. **Connect & Deposit** — Lock JUNGLE tokens into the escrow contract
2. **Get Your Monkey** — Unique monkey & boat generated from your wallet address
3. **Buy Power-Ups** — Spin mystery packs for speed boosts, shields, shortcuts
4. **Burn Goal** — When community deposits enough tokens, all tokens are burned
5. **Race on Chain** — Deterministic race computation, first monkey to island wins NFT
6. **Safe Exit** — Goal not met? Withdraw tokens back minus 2% fee

## Tech Stack

- **Smart Contracts:** Solidity (Robinhood Chain EVM / Arbitrum Orbit)
- **Frontend:** Next.js 15 + React 19 + TailwindCSS
- **Wallet:** wagmi + viem + RainbowKit
- **Animations:** Framer Motion

## Project Structure

```
jungle-bay-raffle/
├── contracts/
│   ├── RaffleEscrow.sol      # Deposit, burn goal, refund logic
│   ├── RaceEngine.sol         # On-chain race computation
│   └── PowerUpPacks.sol       # Pack spinning, power-up minting
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   ├── components/         # Monkey, PackSpinner, RaceTrack
│   │   ├── hooks/              # Contract hooks
│   │   └── styles/            # Global styles
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.ts
├── pitch-deck.html            # 10-slide pitch deck
└── README.md
```

## Smart Contracts

### RaffleEscrow.sol
- Users deposit JUNGLE tokens
- Burn goal tracked on-chain (0.13 ETH worth of tokens)
- If goal met: all tokens burned, NFT transferred to race winner
- If goal not met: users withdraw tokens minus 2% fee

### RaceEngine.sol
- Each racer gets base speed proportional to tokens locked (logarithmic scaling)
- Power-ups modify speed, shields, shortcuts
- Deterministic race computation using wallet + tokens + power-ups + block data
- Fair: whales have advantage but power-ups can close the gap

### PowerUpPacks.sol
- Buy packs with JUNGLE tokens (default: 1000 JNG per pack)
- Randomized power-up reveal (speed, shield, shortcut)
- Intensity 1-10, weighted toward middle
- Applied directly to racer on RaceEngine contract

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Contracts
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compile
forge build

# Deploy to Robinhood Chain
forge create contracts/RaffleEscrow.sol:RaffleEscrow \
  --rpc-url $RH_CHAIN_RPC \
  --private-key $PRIVATE_KEY \
  --constructor-args $TOKEN_ADDR $NFT_ADDR $NFT_TOKEN_ID $BURN_GOAL $DEADLINE_DAYS
```

## Tokenomics

| Parameter | Value |
|-----------|-------|
| NFT Prize Value | 0.1 ETH |
| Burn Goal | 0.13 ETH worth of JNG |
| Refund Fee | 2% |
| Pack Price | 1,000 JNG |

## Race Mechanics

| Power-Up | Effect |
|----------|--------|
| ⚡ Speed Boost | +25 base speed per intensity level |
| 🛡️ Shield | Reduces finish time penalty by 5% each |
| 🌊 Shortcut | Skips 10-30% of race distance |

## License

MIT

---

Built by Robin Hood Hunters 🏹