import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "hardhat-watcher";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  networks: {
    goerli: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  watcher: {
    test: {
      files: ["./contracts", "./test"],
      tasks: [{ command: "test" }],
    },
  },
};

export default config;
