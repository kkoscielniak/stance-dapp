import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

describe.only("Stance", () => {
  const deployStanceFixture = async () => {
    const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

    const StanceContractFactory = await ethers.getContractFactory("Stance");
    const StanceContract = await StanceContractFactory.deploy();

    return { StanceContract, owner, otherAccount, otherAccount2 };
  };

  describe("Asking questions", () => {
    it("should ask a question", async () => {
      const { StanceContract } = await loadFixture(deployStanceFixture);

      await StanceContract.askQuestion("Is this a real life?");
      await StanceContract.askQuestion("Is this just fantasy?");
      const questions = await StanceContract.getAllQuestions();

      expect(questions.length).to.eq(2);
    });

    it("should emit an event once the question has been asked", async () => {
      const { StanceContract, owner } = await loadFixture(deployStanceFixture);

      await expect(await StanceContract.askQuestion("Is this a real life?"))
        .to.emit(StanceContract, "QuestionAsked")
        .withArgs(0, "Is this a real life?", owner.address);
    });
  });

  describe("Getting questions", async () => {
    it("should return all questions", async () => {
      const { StanceContract } = await loadFixture(deployStanceFixture);

      await StanceContract.askQuestion("Is this a real life?");
      await StanceContract.askQuestion("Is this just fantasy?");
      const questions = await StanceContract.getAllQuestions();

      expect(questions.length).to.eq(2);
    });

    it("should return a proper question by ID", async () => {
      const { StanceContract } = await loadFixture(deployStanceFixture);

      await StanceContract.askQuestion("Is this a real life?");
      await StanceContract.askQuestion("Is this just fantasy?");
      const questionById = await StanceContract.getQuestionById(1);

      expect(questionById.question).to.eq("Is this just fantasy?");
    });
  });

  describe("Responding to the questions", async () => {
    it("should save positive responses", async () => {
      const { StanceContract, otherAccount } = await loadFixture(
        deployStanceFixture
      );

      await StanceContract.askQuestion("Is this a real life?");

      await StanceContract.connect(otherAccount).respondToQuestionPositively(0);

      const question = await StanceContract.getQuestionById(0);
      expect(question.positiveResponsesCount).to.eq(1);
      expect(question.negativeResponsesCount).to.eq(0);
    });

    it("should save negative responses", async () => {
      const { StanceContract, otherAccount } = await loadFixture(
        deployStanceFixture
      );

      await StanceContract.askQuestion("Is this just fantasy?");

      await StanceContract.connect(otherAccount).respondToQuestionNegatively(0);

      const question = await StanceContract.getQuestionById(0);
      expect(question.positiveResponsesCount).to.eq(0);
      expect(question.negativeResponsesCount).to.eq(1);
    });

    it("should save both positive and negative responses", async () => {
      const { StanceContract, otherAccount, otherAccount2 } = await loadFixture(
        deployStanceFixture
      );

      await StanceContract.askQuestion("Is this both?");

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

      await StanceContract.askQuestion("Is this a real life?");

      await StanceContract.connect(otherAccount).respondToQuestionPositively(0);
      await StanceContract.connect(otherAccount2).respondToQuestionPositively(
        0
      );
      await expect(
        StanceContract.connect(otherAccount).respondToQuestionPositively(0)
      ).to.be.revertedWith("Can't answer the same question twice");
    });

    it("should not allow the user to answer his own question", async () => {
      const { StanceContract, owner } = await loadFixture(deployStanceFixture);

      await StanceContract.askQuestion("Is this a real life?");

      await expect(
        StanceContract.connect(owner).respondToQuestionPositively(0)
      ).to.be.revertedWith("Can't answer your own question");
    });
  });
});
