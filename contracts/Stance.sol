// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9; 

import "hardhat/console.sol";
import "./structs/Question.sol";

contract Stance {
  Question[] private questions;

  event QuestionAsked(uint id, string question, address author);

  constructor() {
    console.log("This is a test");
  }

  function askQuestion(
    string memory _question
  ) public {
    Question memory question = Question(
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

  function getAllQuestions() public view returns(Question[] memory) {
    return questions;
  }

  function getQuestionById(uint256 id) public view returns(Question memory) {
    return questions[id];
  }

  function answerQuestion(Question memory _question, bool positiveAnswer) public pure {
    if (positiveAnswer) {
      _question.positiveResponsesCount++; // TODO: Use SafeMath
    } else {
      _question.negativeResponsesCount++; // TODO: SafeMath
    }
  }

  // TODO: Use SafeMath here
  function _getPositiveResponsesRatioForQuestion(Question memory _question) public pure returns (uint16) {
    return _question.positiveResponsesCount / (_question.negativeResponsesCount + _question.positiveResponsesCount);
  }
}