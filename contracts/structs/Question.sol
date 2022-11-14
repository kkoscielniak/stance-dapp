// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9; 

struct Question {
  // uint256 id;
  address author;
  uint256 timestamp;
  // uint256 prizeAmount;
  string question; 
  uint16 positiveResponsesCount;
  uint16 negativeResponsesCount;
  // url of the hero image
  // deadline, 
}