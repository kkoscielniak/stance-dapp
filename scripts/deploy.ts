import { ethers } from "hardhat";

async function main() {
  const StanceContractFactory = await ethers.getContractFactory("Stance");
  const StanceContract = await StanceContractFactory.deploy();
  
  await StanceContract.deployed();

  console.log(`Stance contract deployed to ${StanceContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
