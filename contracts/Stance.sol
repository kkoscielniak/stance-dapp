// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9; 

import "hardhat/console.sol";
import "./structs/Question.sol";

contract Stance {
  Question[] private questions;

  event QuestionAsked(uint id, string question, address author);

  constructor() {}

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

  // function answerQuestion(uint _id, bool _isAnswerPositive) public {
  //   Question storage _question = questions[_id];

  //   if (_isAnswerPositive) {
  //     _question.positiveResponsesCount++; // TODO: Use SafeMath
  //   } else {
  //     _question.negativeResponsesCount++; // TODO: SafeMath
  //   }
  // }

  // TODO: Describe why they are split instead of taking a parameter
  function respondToQuestionPositively(uint _id) public {
    Question storage _question = questions[_id];
    _question.positiveResponsesCount++; // TODO use SafeMath
  }

  function respondToQuestionNegatively(uint _id) public {
    Question storage _question = questions[_id];
    _question.negativeResponsesCount++; // TODO use SafeMath
  }
}