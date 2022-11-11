// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9; 

import "hardhat/console.sol";
import "./structs/Question.sol";

contract Stance {
  Question[] private questions;

  constructor() {
    console.log("This is a test");
  }

  function askQuestion(
    string memory _question, 
    string memory _answerA, 
    string memory _answerB, 
    uint256 _prizeAmount
  ) public {
    Question memory question = Question(
      msg.sender, 
      block.timestamp, 
      _prizeAmount,
      _question, 
      _answerA, 
      _answerB
    ); 

    questions.push(question);
  }

  function getAllQuestions() public view returns(Question[] memory) {
    return questions;
  }
}