// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./structs/Question.sol";

contract Stance {
    modifier onlyOncePerUserPerQuestion(uint _id) {
        require(
            answeredQuestions[msg.sender][_id] == false,
            "Can't answer the same question twice"
        );
        _;
    }

    modifier onlyNonOwner(uint _id) {
        require(
            questions[_id].author != msg.sender,
            "Can't answer your own question"
        );
        _;
    }

    modifier requiredToPay() {
        require(msg.value >= 0.001 ether, "Asking question costs 0.001 ether");
        _;
    }

    Question[] private questions;
    uint256 private seed;

    mapping(address => mapping(uint => bool)) answeredQuestions;

    event QuestionAsked(uint id, string question, address author);

    constructor() {
        seed = (block.timestamp + block.difficulty) % 100;
    }

    /**
     * @notice Generates a random number
     * @dev This is a deterministic and NOT SAFE FOR PRODUCTION.
     * Since this contract is a demo for learning purposes, I can live with that,
     * but for production-class contract I would use Chainlink VRF.
     * Also, this fn is public for testing purposes.
     * @return random number in range [0, 99]
     */
    function getRandomNumber() public returns (uint256) {
        seed = (seed + block.timestamp + block.difficulty) % 100;
        return seed;
    }

    function askQuestion(string memory _question) public payable requiredToPay {
        Question memory question = Question(
            true,
            msg.sender,
            block.timestamp,
            _question,
            0,
            0
        );

        questions.push(question);
        uint id = questions.length - 1;

        emit QuestionAsked(id, _question, msg.sender);
    }

    function getAllQuestions() public view returns (Question[] memory) {
        return questions;
    }

    function getQuestionById(uint256 id) public view returns (Question memory) {
        return questions[id];
    }

    function calculateAndTransferThePrize() private {
        if (address(this).balance == 0) {
            return;
        }

        uint256 rand = getRandomNumber();

        if (rand >= 50) {
            payable(msg.sender).transfer(address(this).balance);
        }
    }

    // TODO: Describe why they are split instead of taking a parameter
    function respondToQuestionPositively(uint _id)
        public
        onlyOncePerUserPerQuestion(_id)
        onlyNonOwner(_id)
    {
        Question storage _question = questions[_id];
        calculateAndTransferThePrize();
        _question.positiveResponsesCount++; // TODO use SafeMath
        answeredQuestions[msg.sender][_id] = true;
    }

    function respondToQuestionNegatively(uint _id)
        public
        onlyOncePerUserPerQuestion(_id)
        onlyNonOwner(_id)
    {
        Question storage _question = questions[_id];
        calculateAndTransferThePrize();
        _question.negativeResponsesCount++; // TODO use SafeMath
        answeredQuestions[msg.sender][_id] = true;
    }
}
