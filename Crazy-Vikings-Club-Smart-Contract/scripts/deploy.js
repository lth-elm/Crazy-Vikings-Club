// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { network } = require("hardhat");
const hre = require("hardhat");

// const name = "Crazy Vikings Club";
// const symbol = "CVC";
const receiver = "0x4F80C0239E69a36d4ED25086c300899c879654B9";
const feeNumerator = 300;

const priceLevelOne = "415000000000000000"; // 100 $ to BNB
const priceLevelTwo = "520000000000000000"; // 125 $ to BNB
const priceLevelThree = "625000000000000000"; // 150 $ to BNB

async function main() {
  const WAIT_BLOCK_CONFIRMATIONS = 6;

  const CrazyVikingsClub = await hre.ethers.getContractFactory("CrazyVikingsClub");
  const crazyVikingsContract = await CrazyVikingsClub.deploy(receiver, feeNumerator);
  console.log("Crazy Vikings Club verification pending...");
  await crazyVikingsContract.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
  console.log(`Crazy Vikings Club deployed to ${crazyVikingsContract.address} on ${network.name}`);

  console.log("Verifying Crazy Vikings Club contract...");
  await hre.run(`verify:verify`, {
    address: crazyVikingsContract.address,
    constructorArguments: [receiver, feeNumerator],
    contract: "contracts/CrazyVikingsClub.sol:CrazyVikingsClub",
  });

  const CrazyVikingsShop = await hre.ethers.getContractFactory("CrazyVikingsShop");
  const crazyShopContract = await CrazyVikingsShop.deploy(
    crazyVikingsContract.address,
    priceLevelOne,
    priceLevelTwo,
    priceLevelThree
  );
  console.log("Crazy Vikings Shop dverification pending...");
  await crazyShopContract.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
  console.log(`Crazy Vikings Shop deployed to ${crazyShopContract.address} on ${network.name}`);

  console.log("Verifying Crazy Vikings Shop contract...");
  await hre.run(`verify:verify`, {
    address: crazyShopContract.address,
    constructorArguments: [crazyVikingsContract.address, priceLevelOne, priceLevelTwo, priceLevelThree],
    contract: "contracts/CrazyVikingsShop.sol:CrazyVikingsShop",
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
