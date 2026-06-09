# Lets Buy Jungle Bay Contracts

## Install

```bash
cd contracts
npm install
cp .env.example .env
```

## Compile

```bash
npm run compile
```

## Deploy Base

```bash
npm run deploy:base
```

## Verify

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS> 0x6d127Aaee27B4E6608bd4E77350724F2E6F342A1
```

## Notes

This package intentionally skips tests because the owner wants to write Hardhat tests manually.

Rules:
- 3-day rounds
- target = manually-entered floor + 0.1 ETH
- 3% accrued fee
- weighted entries
- reveal after round ends
- user refunds if target missed
- owner withdraws only after winner selected
