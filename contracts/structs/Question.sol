// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9; 

struct Question {
  address author;
  uint256 timestamp;
  uint256 prizeAmount;
  string question; 
  // url of the hero image
  string answerA;
  string answerB;
  // deadline
}