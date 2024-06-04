// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

interface TokenInterface {
    function mint(address account, uint256 amount) external;
}

contract TokenShop {
    // Native Network PAIR
    AggregatorV3Interface internal priceFeed;
    // gamesToken is 18 decimal places, and we want to sell 1 token for 0.02 usd
    TokenInterface public minter;
    uint256 public gamesTokenPriceInCents = 2; // for testing 1 token = 0.02 usd, in the chainlink 8 decimal place return format
    address public owner;

    mapping(address => bool) public allowedPlayers;
    mapping(address => bool) public gamemasters;

    struct Proposal {
        uint256 newPrice;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        mapping(address => bool) voters;
    }

    Proposal public proposal;

    event PlayerAllowed(address indexed player);
    event GamemasterAdded(address indexed gamemaster);
    event ProposalCreated(uint256 newPrice, uint256 deadline);
    event Voted(address indexed voter, bool voteFor);
    event ProposalExecuted(uint256 newPrice);

    constructor(address aggregator) {
        priceFeed = AggregatorV3Interface(aggregator);
        owner = msg.sender;
        allowedPlayers[owner] = true;
        gamemasters[owner] = true;
    }

    /**
    * Allow the admin to change the token address
    */
    function setTokenAddress(address tokenAddress) external onlyOwner {
        minter = TokenInterface(tokenAddress);
    }

    /**
    * Returns the latest answer
    */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        (
        /*uint80 roundID*/,
            int price,
        /*uint startedAt*/,
        /*uint timeStamp*/,
        /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    function getMATICForOneGT() public view returns (uint256) {
        uint256 maticPriceInUSD = uint256(getChainlinkDataFeedLatestAnswer()); // MATIC price in USD with 8 decimal places
        uint256 maticForOneCent = 10 ** 10 / maticPriceInUSD; // Calculate MATIC amount for one cent
        uint256 maticForOneGT = maticForOneCent * gamesTokenPriceInCents; // tokenPrice is in cents
        return maticForOneGT;
    }

    function getMATICForGTs(uint256 numberOfGTs) public view returns (uint256) {
        uint256 maticForOneGT = getMATICForOneGT();
        uint256 totalMATICForGTs = maticForOneGT * numberOfGTs;
        return totalMATICForGTs;
    }

    function buyAmountTokens(uint256 numberOfGTs) public payable onlyAllowed {
        uint256 requiredMATIC = getMATICForGTs(numberOfGTs);
        require(msg.value >= requiredMATIC, "Insufficient MATIC sent");

        minter.mint(msg.sender, numberOfGTs * 10 ** 18); // Minting tokens with proper decimal adjustment
    }

    // based on the amount sent in, give the number of tokens as long as its over the price of one token
    function buyTokens() public payable onlyAllowed {
        require(msg.value >= getMATICForOneGT(), "Insufficient MATIC sent");
        uint256 numberOfGTs = msg.value / getMATICForOneGT();
        minter.mint(msg.sender, numberOfGTs * 10 ** 18); // Minting tokens with proper decimal adjustment
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function allowPlayer(address player) external onlyOwner {
        allowedPlayers[player] = true;
        emit PlayerAllowed(player);
    }

    function addGamemaster(address gamemaster) external onlyOwner {
        gamemasters[gamemaster] = true;
        emit GamemasterAdded(gamemaster);
    }

    modifier onlyAllowed() {
        require(allowedPlayers[msg.sender] || gamemasters[msg.sender], "Not allowed");
        _;
    }

    function createProposal(uint256 newPrice) external onlyAllowed {
        require(proposal.deadline == 0 || block.timestamp > proposal.deadline, "Previous proposal still active");

        proposal.newPrice = newPrice;
        proposal.votesFor = 0;
        proposal.votesAgainst = 0;
        proposal.deadline = block.timestamp + 1 weeks;
        proposal.executed = false;

        emit ProposalCreated(newPrice, proposal.deadline);
    }

    function vote(bool voteFor) external onlyAllowed {
        require(block.timestamp <= proposal.deadline, "Voting period has ended");
        require(!proposal.voters[msg.sender], "Already voted");

        proposal.voters[msg.sender] = true;

        if (voteFor) {
            proposal.votesFor += 1;
        } else {
            proposal.votesAgainst += 1;
        }

        emit Voted(msg.sender, voteFor);
    }

    function executeProposal() external onlyAllowed {
        require(block.timestamp > proposal.deadline, "Voting period not ended yet");
        require(!proposal.executed, "Proposal already executed");

        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 requiredVotes = totalVotes / 2;

        if (proposal.votesFor >= requiredVotes) {
            gamesTokenPriceInCents = proposal.newPrice;
            emit ProposalExecuted(proposal.newPrice);
        }

        proposal.executed = true;
    }
}
