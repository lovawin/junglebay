const hre = require("hardhat");

async function main() {
  const feeWallet =
    process.env.FEE_WALLET || "0xf5313B03dDFa8EeffFb3fD9D2786b98aDb5B1149";

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
