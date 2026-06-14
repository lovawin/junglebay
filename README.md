# Let's Buy A Jungle Bay — V3 Deposit Flow

## Added In V3

- Deposit panel
- Wallet connected check
- ETH amount input
- `deposit()` contract write
- Pending / confirming / success / error UI
- Homepage integration

## Install

Contracts:

```bash
cd contracts
npm install
npm run compile
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run build
npm run dev
```

## Env

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_RAFFLE_ADDRESS=0xYourDeployedContract
NEXT_PUBLIC_OWNER_ADDRESS=0xf5313B03dDFa8EeffFb3fD9D2786b98aDb5B1149
```
