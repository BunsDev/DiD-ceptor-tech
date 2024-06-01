// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Chainlink Bootcamp's TokenShop as scaffold, GamesDAO manages the minting and pricing of GamesToken based on Chainlink price feeds.
// It allows for gamemaster proposals on token pricing, which can be voted on by allowed players and gamemasters.
// Written in the Chainlink BlockMagic Hackathon for Ceptor Games Team by Tippi Fifestarr. We will progressively decentralize.
// Initially deploying on Polygon Amoy Testnet, I plan to deploy these on Scroll, ZkSync, Optimism, and Metis
// Since only Polygon and Avax and Ethereum are currently supported by CCIP, the next version will CCIPGamesDAO on Polygon first.

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
// for CCIP, see CCIPGamesDAO.sol (not written yet at this time)

interface TokenInterface {
    function mint(address account, uint256 amount) external;
}

contract GamesDAO {
    AggregatorV3Interface internal priceFeed;
    TokenInterface public minter;
    uint256 public gamesTokenPriceInCents = 2; // 1 token = 0.02 USD
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

    constructor() {
        // Initialize the price feed for MATIC/USD on Polygon
        priceFeed = AggregatorV3Interface(0x001382149eBa3441043c1c66972b4772963f5D43);
        owner = msg.sender;
        allowedPlayers[owner] = true;
        gamemasters[owner] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAllowed() {
        require(allowedPlayers[msg.sender] || gamemasters[msg.sender], "Not allowed");
        _;
    }

    // Set the token contract address for minting
    function setTokenAddress(address tokenAddress) external onlyOwner {
        minter = TokenInterface(tokenAddress);
    }

    // Retrieve the latest price of MATIC in USD
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        (, int price,,,) = priceFeed.latestRoundData();
        return price;
    }

    // Calculate the amount of MATIC required to buy one GamesToken
    function getMATICForOneGT() public view returns (uint256) {
        uint256 maticPriceInUSD = uint256(getChainlinkDataFeedLatestAnswer());
        return (10 ** 10 / maticPriceInUSD) * gamesTokenPriceInCents;
    }

    // Calculate the total MATIC required for a given number of GamesTokens
    function getMATICForGTs(uint256 numberOfGTs) public view returns (uint256) {
        return getMATICForOneGT() * numberOfGTs;
    }

    // Allow players to buy a specified number of GamesTokens
    function buyAmountTokens(uint256 numberOfGTs) public payable onlyAllowed {
        uint256 requiredMATIC = getMATICForGTs(numberOfGTs);
        require(msg.value >= requiredMATIC, "Insufficient MATIC sent");
        minter.mint(msg.sender, numberOfGTs * 10 ** 18);
    }

    // Allow players to buy GamesTokens based on the MATIC sent
    function buyTokens() public payable onlyAllowed {
        uint256 numberOfGTs = msg.value / getMATICForOneGT();
        require(numberOfGTs > 0, "Insufficient MATIC sent");
        minter.mint(msg.sender, numberOfGTs * 10 ** 18);
    }

    // Allow the owner to withdraw contract balance
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Allow the owner to permit a player to participate
    function allowPlayer(address player) external onlyOwner {
        allowedPlayers[player] = true;
        emit PlayerAllowed(player);
    }

    // Allow the owner to designate a gamemaster
    function addGamemaster(address gamemaster) external onlyOwner {
        gamemasters[gamemaster] = true;
        emit GamemasterAdded(gamemaster);
    }

    // Create a proposal for changing the token price
    function createProposal(uint256 newPrice) external onlyAllowed {
        require(proposal.deadline == 0 || block.timestamp > proposal.deadline, "Previous proposal still active");

        proposal.newPrice = newPrice;
        proposal.votesFor = 0;
        proposal.votesAgainst = 0;
        proposal.deadline = block.timestamp + 1 weeks;
        proposal.executed = false;

        emit ProposalCreated(newPrice, proposal.deadline);
    }

    // Allow allowed users to vote on the active proposal
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

    // Execute the proposal if voting is complete and conditions are met
    function executeProposal() external onlyAllowed {
        require(block.timestamp > proposal.deadline, "Voting period not ended yet");
        require(!proposal.executed, "Proposal already executed");
        if (proposal.votesFor > proposal.votesAgainst) {
            gamesTokenPriceInCents = proposal.newPrice;
            emit ProposalExecuted(proposal.newPrice);
        }
        proposal.executed = true;
    }
}