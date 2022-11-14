const main = async () => {
  const stanceContractFactory = await hre.ethers.getContractFactory("Stance");
  const stanceContract = await stanceContractFactory.deploy({
    // value: hre.ethers.utils.parseEther("0.1"),
  });
  await stanceContract.deployed();
  
  console.log("Contract deployed to", stanceContract.address);

  //getcontract balance
  let contractBalance = await hre.ethers.provider.getBalance(
    stanceContract.address
  );
  console.log("contractBalance", hre.ethers.utils.formatEther(contractBalance));

  const firstQuestionTxn = await stanceContract.askQuestion(
    "Is this a real life?",
    // hre.ethers.utils.parseEther("0.001")
  ); 
  await firstQuestionTxn.wait();

  const secondQuestionTxn = await stanceContract.askQuestion(
    "Is this just fantasy?"
    // hre.ethers.utils.parseEther("0.001")
  );
  await secondQuestionTxn.wait();

  // let allQuestions = await stanceContract.getAllQuestions();
  // console.log(allQuestions);

  let q1 = await stanceContract.getQuestionById(1);
  // await q1.wait();
  // console.log(q1);


  const firstResponseTxn = await stanceContract.answerQuestion(1, true); 
  firstResponseTxn.wait();

  const secondResponseTxn = await stanceContract.answerQuestion(1, false);
  secondResponseTxn.wait();

  let allQuestions = await stanceContract.getAllQuestions();
  console.log(allQuestions);
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
