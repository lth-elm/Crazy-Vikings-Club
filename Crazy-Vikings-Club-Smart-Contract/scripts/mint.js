require("dotenv").config();
const { ethers } = require("ethers");
const abi = require("../artifacts/contracts/CrazyVikingsClub.sol/CrazyVikingsClub.json");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_URL = process.env.API_URL;

const CONTRACT_ADDRESS = "0xA3202D542710D79499AE7C466F2148941E95B40d";
const MINT_TO = "0x46ed417d3034603BB064F93723de67a7342AE702";
const MAX_SUPPLY = 2500;
const BATCH_SIZE = 100;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
const contractWithSigner = contract.connect(signer);

mint(contractWithSigner);

async function mint(contract) {
  let totalSupply = (await contract.totalSupply()).toNumber();
  console.log("Current total supply: ", totalSupply);

  while (totalSupply + BATCH_SIZE <= MAX_SUPPLY) {
    try {
      let transaction = await contract.mint(MINT_TO, BATCH_SIZE.toString());
      await transaction.wait();

      totalSupply = totalSupply + BATCH_SIZE;

      console.log(transaction.hash);
      console.log("New total supply: ", totalSupply);
      sleep(300);
    } catch (error) {
      console.log(error);
      sleep(1000);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
