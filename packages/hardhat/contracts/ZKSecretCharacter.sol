// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
// Deployed on zkSync Sepolia Testnet: https://sepolia.explorer.zksync.io/address/0xA6bA847c70cB1eea5811f8C79632C09CF0478FCA#contract

import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @title ZKSecrets
 * @dev This contract allows users to store secrets on-chain. 
 * Each user has their own mapping of secrets. 
 * The contract uses Chainlink price feeds to check for a payment of 0.1 USD for each secret stored.
 */
contract ZKSecrets {
    AggregatorV3Interface internal dataFeed;
    mapping(address => bytes32[5]) private secrets;

    /**
     * @dev Constructor sets the address for the Chainlink price feed.
     * The address is for the ETH/USD price feed on the zkSync Sepolia Testnet.
     */
    constructor() {
        dataFeed = AggregatorV3Interface(
            0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF
        );
    }

    /**
     * @dev Stores secrets for the sender. Requires a payment of 0.1 USD.
     * @param _secrets An array of secrets to be stored.
     */
        function storeSecrets(bytes32[5] memory _secrets) public payable {
        require(msg.value >= (uint(getLatestPrice()) / 10000), "Payment of 0.3 USD required");
        secrets[msg.sender] = _secrets;
    }

    /**
     * @dev Returns the latest price from the Chainlink price feed.
     * @return The latest price.
     */
    function getLatestPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return price; // example answer: 377586779077
    }
}
