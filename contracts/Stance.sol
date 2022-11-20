// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./structs/Question.sol";

contract Stance {
    modifier onlyOncePerUserPerQuestion() {
        require(
            answeredQuestionsMapping[msg.sender].valid == false,
            "Can't answer the same question twice"
        );
        _;
    }

    modifier onlyNonOwner(uint _id) {
        require(questions[_id].author != msg.sender, "Can't answer your own question");
        _;
    }

    Question[] private questions;

    mapping(address => Question) answeredQuestionsMapping;

    event QuestionAsked(uint id, string question, address author);

    constructor() {}

    function askQuestion(string memory _question) public {
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

    // TODO: Describe why they are split instead of taking a parameter
    function respondToQuestionPositively(uint _id)
        public
        onlyOncePerUserPerQuestion
        onlyNonOwner(_id)
    {
        Question storage _question = questions[_id];
        _question.positiveResponsesCount++; // TODO use SafeMath
        answeredQuestionsMapping[msg.sender] = questions[_id];
    }

    function respondToQuestionNegatively(uint _id)
        public
        onlyOncePerUserPerQuestion
        onlyNonOwner(_id)
    {
        Question storage _question = questions[_id];
        _question.negativeResponsesCount++; // TODO use SafeMath
        answeredQuestionsMapping[msg.sender] = questions[_id];
    }
}
