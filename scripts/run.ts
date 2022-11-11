const main = async () => {
  // const [_, randomPerson] = await hre.ethers.getSigners();
  const stanceContractFactory = await hre.ethers.getContractFactory("Stance");
  const stanceContract = await stanceContractFactory.deploy({
    // value: hre.ethers.utils.parseEther("0.1"),
  });
  await stanceContract.deployed();
  
  console.log("Contract deployed to", stanceContract.address);

  // // get waves
  // let waveCount = await stanceContract.getTotalWaves();
  // console.log(waveCount.toNumber());

  //getcontract balance
  let contractBalance = await hre.ethers.provider.getBalance(
    stanceContract.address
  );
  console.log("contractBalance", hre.ethers.utils.formatEther(contractBalance));

  // const waveTxn = await stanceContract.wave("This is wave #1");
  // await waveTxn.wait();

  // const waveTxn2 = await stanceContract.wave("This is wave #2");
  // await waveTxn2.wait();

  // contractBalance = await hre.ethers.provider.getBalance(stanceContract.address);
  // console.log(
  //   "Contract balance:",
  //   hre.ethers.utils.formatEther(contractBalance)
  // );

  // let allWaves = await stanceContract.getAllWaves();
  // console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
