const hre = require("hardhat");

async function main() {
  const feeWallet =
    process.env.FEE_WALLET || "0x6d127Aaee27B4E6608bd4E77350724F2E6F342A1";

  const Contract = await hre.ethers.getContractFactory("LetsBuyJungleBay");
  const raffle = await Contract.deploy(feeWallet);

  await raffle.waitForDeployment();

  const address = await raffle.getAddress();

  console.log("LetsBuyJungleBay deployed to:", address);
  console.log("Fee wallet:", feeWallet);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
