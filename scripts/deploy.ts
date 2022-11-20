import { ethers } from "hardhat";

async function main() {
  const StanceContractFactory = await ethers.getContractFactory("Stance");
  console.log(`Stance contract created`);
  
  const StanceContract = await StanceContractFactory.deploy();
  
  console.log(`Stance contract deployment started`);
  await StanceContract.deployed();
  
  console.log(`Stance contract deployed to ${StanceContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
