import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import chai, { expect } from "chai";
import { smock } from "@defi-wonderland/smock";
import { Stance__factory } from "../typechain-types";
import { BigNumber } from "ethers";
chai.use(smock.matchers);

describe("Stance", () => {
  const deployStanceFixture = async () => {
    const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

    const StanceContractFactory = await ethers.getContractFactory("Stance");
    const StanceContract = await StanceContractFactory.deploy();

    return {
      StanceContract,
      StanceContractFactory,
      owner,
      otherAccount,
      otherAccount2,
    };
  };

  describe("Asking questions", () => {
    it("should ask a question", async () => {
      const { StanceContract } = await loadFixture(deployStanceFixture);

      await StanceContract.askQuestion("Is this a real life?", {
        value: ethers.utils.parseEther("0.001"),
      });
      await StanceContract.askQuestion("Is this just fantasy?", {
        value: ethers.utils.parseEther("0.001"),
      });
      const questions = await StanceContract.getAllQuestions();

      expect(questions.length).to.eq(2);
    });

    it("should emit an event once the question has been asked", async () => {
      const { StanceContract, owner } = await loadFixture(deployStanceFixture);

      await expect(
        await StanceContract.askQuestion("Is this a real life?", {
          value: ethers.utils.parseEther("0.001"),
        })
      )
        .to.emit(StanceContract, "QuestionAsked")
        .withArgs(0, "Is this a real life?", owner.address);
    });

    it("should fund the contract when asking a question", async () => {
      const { StanceContract } = await loadFixture(
        deployStanceFixture
      );

      await StanceContract.askQuestion("Is this a real life?", {
        value: ethers.utils.parseEther("0.001"),
      });
      await StanceContract.askQuestion("Is this just fantasy?", {
        value: ethers.utils.parseEther("0.001"),
      });

      expect(
        await StanceContract.provider.getBalance(StanceContract.address)
      ).to.equal(ethers.utils.parseEther("0.002"));
    });

    it("should throw an error if the function call does not have value", async () => {
      const { StanceContract, owner } = await loadFixture(deployStanceFixture);

      await expect(
        StanceContract.askQuestion("Is this a real life?")
      ).to.be.revertedWith("Asking question costs 0.001 ether");
    });
  });

  describe("Getting questions", async () => {
    it("should return all questions", async () => {
      const { StanceContract } = await loadFixture(deployStanceFixture);

      await StanceContract.askQuestion("Is this a real life?", {
        value: ethers.utils.parseEther("0.001"),
      });
      await StanceContract.askQuestion("Is this just fantasy?", {
        value: ethers.utils.parseEther("0.001"),
      });
      const questions = await StanceContract.getAllQuestions();

      expect(questions.length).to.eq(2);
    });

    it("should return a proper question by ID", async () => {
      const { StanceContract } = await loadFixture(deployStanceFixture);

      await StanceContract.askQuestion("Is this a real life?", {
        value: ethers.utils.parseEther("0.001"),
      });
      await StanceContract.askQuestion("Is this just fantasy?", {
        value: ethers.utils.parseEther("0.001"),
      });
      const questionById = await StanceContract.getQuestionById(1);

      expect(questionById.question).to.eq("Is this just fantasy?");
    });
  });

  describe("Responding to the questions", async () => {
    it("should save positive responses", async () => {
      const { StanceContract, otherAccount } = await loadFixture(
        deployStanceFixture
      );

      await StanceContract.askQuestion("Is this a real life?", {
        value: ethers.utils.parseEther("0.001"),
      });

      await StanceContract.connect(otherAccount).respondToQuestionPositively(0);

      const question = await StanceContract.getQuestionById(0);
      expect(question.positiveResponsesCount).to.eq(1);
      expect(question.negativeResponsesCount).to.eq(0);
    });

    it("should save negative responses", async () => {
      const { StanceContract, otherAccount } = await loadFixture(
        deployStanceFixture
      );

      await StanceContract.askQuestion("Is this just fantasy?", {
        value: ethers.utils.parseEther("0.001"),
      });

      await StanceContract.connect(otherAccount).respondToQuestionNegatively(0);

      const question = await StanceContract.getQuestionById(0);
      expect(question.positiveResponsesCount).to.eq(0);
      expect(question.negativeResponsesCount).to.eq(1);
    });

    it("should save both positive and negative responses", async () => {
      const { StanceContract, otherAccount, otherAccount2 } = await loadFixture(
        deployStanceFixture
      );

      await StanceContract.askQuestion("Is this both?", {
        value: ethers.utils.parseEther("0.001"),
      });

      await StanceContract.connect(otherAccount).respondToQuestionNegatively(0);
      await StanceContract.connect(otherAccount2).respondToQuestionPositively(
        0
      );

      const question = await StanceContract.getQuestionById(0);
      expect(question.positiveResponsesCount).to.eq(1);
      expect(question.negativeResponsesCount).to.eq(1);
    });

    it("should allow the user only one response per question", async () => {
      const { StanceContract, otherAccount, otherAccount2 } = await loadFixture(
        deployStanceFixture
      );

      await StanceContract.askQuestion("Is this a real life?", {
        value: ethers.utils.parseEther("0.001"),
      });
      await StanceContract.askQuestion("Is this just fantasy?", {
        value: ethers.utils.parseEther("0.001"),
      });
      await StanceContract.askQuestion(
        "Caught in a landside, No escape from reality",
        {
          value: ethers.utils.parseEther("0.001"),
        }
      );

      await StanceContract.connect(otherAccount).respondToQuestionPositively(0);
      await StanceContract.connect(otherAccount2).respondToQuestionPositively(
        0
      );
      await expect(
        StanceContract.connect(otherAccount).respondToQuestionPositively(0)
      ).to.be.revertedWith("Can't answer the same question twice");

      await StanceContract.connect(otherAccount).respondToQuestionPositively(1);
      await StanceContract.connect(otherAccount2).respondToQuestionPositively(
        1
      );

      await expect(
        StanceContract.connect(otherAccount).respondToQuestionPositively(1)
      ).to.be.revertedWith("Can't answer the same question twice");

      await expect(
        StanceContract.connect(otherAccount2).respondToQuestionPositively(1)
      ).to.be.revertedWith("Can't answer the same question twice");

      await StanceContract.connect(otherAccount).respondToQuestionPositively(2);
      await StanceContract.connect(otherAccount2).respondToQuestionPositively(
        2
      );

      await expect(
        StanceContract.connect(otherAccount).respondToQuestionPositively(2)
      ).to.be.revertedWith("Can't answer the same question twice");
    });

    it("should not allow the user to answer his own question", async () => {
      const { StanceContract, owner } = await loadFixture(deployStanceFixture);

      await StanceContract.askQuestion("Is this a real life?", {
        value: ethers.utils.parseEther("0.001"),
      });

      await expect(
        StanceContract.connect(owner).respondToQuestionPositively(0)
      ).to.be.revertedWith("Can't answer your own question");
    });
  });

  describe("Calculating and transferring the prize", async () => {
    it.skip("[SKIPPED] should transfer the prize pool to an account if the random number > 50", async () => {
      const { owner, otherAccount } = await loadFixture(deployStanceFixture);

      const MockStanceContractFactory = await smock.mock<Stance__factory>(
        "Stance"
      );
      const MockStanceContract = await MockStanceContractFactory.deploy();

      // Mocking `getRandomNumber` does not work for some reason
      MockStanceContract.getRandomNumber.returns(BigNumber.from("75"));

      await MockStanceContract.connect(owner).askQuestion(
        "Is this a real life?",
        {
          value: ethers.utils.parseEther("0.001"),
        }
      );

      const preTxnOtherAccountBalance = await otherAccount.getBalance();

      await MockStanceContract.connect(
        otherAccount
      ).respondToQuestionNegatively(0);

      const postTxnOtherAccountBalance = await otherAccount.getBalance();

      expect(await MockStanceContract.provider.getBalance(MockStanceContract.address)).to.equal(0);
      expect(postTxnOtherAccountBalance).to.be.above(preTxnOtherAccountBalance);
    });
  });
});
