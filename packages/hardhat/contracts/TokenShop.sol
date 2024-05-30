// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

// Deploy this contract on Sepolia

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; //Source "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol" not found: File import callback not supported(6275)

interface TokenInterface {
    function mint(address account, uint256 amount) external;
}

contract TokenShop {

    AggregatorV3Interface internal priceFeed;
    TokenInterface public minter;
    uint256 public tokenPrice = 200; // 1 token = 2.00 usd, with 2 decimal places
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

    constructor(address tokenAddress) {
        minter = TokenInterface(tokenAddress);
        /**
        * Network: Sepolia
        * Aggregator: ETH/USD
        * Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
        */
        priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        owner = msg.sender;
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

    function tokenAmount(uint256 amountETH) public view returns (uint256) {
        uint256 ethUsd = uint256(getChainlinkDataFeedLatestAnswer()); // with 8 decimal places
        uint256 amountUSD = amountETH * ethUsd / 10**18; // ETH = 18 decimal places
        uint256 amountToken = amountUSD / tokenPrice / 10**(8/2); // 8 decimal places from ETHUSD / 2 decimal places from token 
        return amountToken;
    }

    receive() external payable {
        uint256 amountToken = tokenAmount(msg.value);
        minter.mint(msg.sender, amountToken);
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
            tokenPrice = proposal.newPrice;
            emit ProposalExecuted(proposal.newPrice);
        }

        proposal.executed = true;
    }
}