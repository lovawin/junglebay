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
npx hardhat verify --network base <CONTRACT_ADDRESS> 0xf5313B03dDFa8EeffFb3fD9D2786b98aDb5B1149
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
