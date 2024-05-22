import { type BigNumberish, formatEther } from "ethers";

export class MissingFunctionsConfig extends Error {
  constructor(network: string) {
    super(`Missing DON 'functions' config in hardhat.config.ts for network: ${network}`);
    this.name = "ErrorMissingFunctionsConfig";
  }
}

export class MissingContractsConfig extends Error {
  constructor(network: string) {
    super(`Missing DON 'contracts' config in hardhat.config.ts for network: ${network}`);
    this.name = "ErrorMissingContractsConfig";
  }
}

export class WrongFunctionsConfig extends Error {
  constructor(network: string) {
    super(`Missing router or donId in hardhat.config.ts for network: ${network}`);
    this.name = "ErrorWrongFunctionsConfig";
  }
}

export class NotEnoughFundsToDistribute extends Error {
  constructor(balance: BigNumberish, required: BigNumberish) {
    super(
      `Not enough funds to distribute | Balance: ${formatEther(balance)} LINK | required: ${formatEther(
        required,
      )} LINK.`,
    );
    this.name = "NotEnoughFundsToDistribute";
  }
}
