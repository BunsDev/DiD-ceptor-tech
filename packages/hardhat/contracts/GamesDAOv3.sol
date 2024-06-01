// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Games Token deployed on Polygon Amoy

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title GamesDAO
 * @dev Manages the minting and pricing of GamesToken based on Chainlink price feeds. Allows for gamemaster proposals on token pricing, which can be voted on by allowed players and gamemasters.
 * Chainlink Block Magic Hackathon for Ceptor Games Team by Tippi Fifestarr.
 */
interface TokenInterface {
    function mint(address account, uint256 amount) external;
}

contract GamesDAOv3 is AccessControl {
    AggregatorV3Interface internal priceFeed;
    TokenInterface public minter;
    uint256 public gamesTokenPriceInCents = 2; // 1 token = 0.02 USD
    address public immutable owner;
    string public greeting = "Hooty, world!";

    bytes32 public constant GAMEMASTER_ROLE = keccak256("GAMEMASTER_ROLE");
    bytes32 public constant PLAYER_ROLE = keccak256("PLAYER_ROLE");
    uint256 public constant TOKEN_DECIMAL_MULTIPLIER = 10 ** 18;
    mapping(address => bool) public allowedPlayers;

    enum ProposalType {CHANGE_PRICE, SEND_FUNDS, UPDATE_CATCHPHRASE}

    struct Proposal {
        ProposalType proposalType;
        string catchphrase;
        uint256 newPrice; // could these be uint64?
        uint256 amount; // could these be uint64?
        uint256 votesFor; // could these be uint64?
        uint256 votesAgainst; // could these be uint64? 
        uint256 deadline;
        bool executed;
        mapping(address => bool) voters;
    }

    struct Player {
        string catchphrase;
    }

    struct Gamemaster {
        bool registered;
        string catchphrase;
        string stylePrompt;
    }

    mapping(address => Player) public players;
    mapping(address => Gamemaster) public gamemasters;
    Proposal public proposal;

    event PlayerAllowed(address indexed player);
    event GamemasterAdded(address indexed gamemaster);
    event ProposalCreated(uint256 newPrice, uint256 amount, string catchphrase, uint256 deadline, ProposalType proposalType);
    event Voted(address indexed voter, bool voteFor);
    event ProposalExecuted(uint256 newPrice, uint256 amount, string catchphrase, ProposalType proposalType);
    event PlayerCatchphraseUpdated(address indexed player, string catchphrase);
    event GamemasterCatchphraseUpdated(address indexed gamemaster, string catchphrase);
    event GamemasterStylePromptUpdated(address indexed gamemaster, string stylePrompt);

    /**
     * @dev Sets the owner, roles and initializes the MATIC/USD price feed on the Polygon Amoy Testnet.
     */
    constructor() {
        priceFeed = AggregatorV3Interface(0x001382149eBa3441043c1c66972b4772963f5D43);
        owner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, owner);
        _grantRole(GAMEMASTER_ROLE, owner);
        _grantRole(PLAYER_ROLE, owner);
    }

    /**
     * @dev Ensures only the owner can call the modified function.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Ensures only allowed players or gamemasters can call the modified function.
     */
    modifier onlyAllowed() {
        // TODO: VERIFY THIS CONDITION
        require(allowedPlayers[msg.sender] || gamemasters[msg.sender].registered, "Not allowed");
        _;
    }

    /**
     * @notice Sets the token contract address for minting.
     * @param tokenAddress The address of the token contract.
     */
    function setTokenAddress(address tokenAddress) external onlyOwner {
        minter = TokenInterface(tokenAddress);
    }

    /**
     * @notice Retrieves the latest price of MATIC in USD from the Chainlink data feed.
     * @return price The latest MATIC price in USD.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        (, int price,,,) = priceFeed.latestRoundData();
        return price;
    }

    /**
     * @notice Calculates the amount of MATIC required to buy one GamesToken.
     * @return howMuchMatic The amount of MATIC needed for one GamesToken.
     */
    function getMATICForOneGT() public view returns (uint256) {
        uint256 maticPriceInUSD = uint256(getChainlinkDataFeedLatestAnswer());
        return (10 ** 10 / maticPriceInUSD) * gamesTokenPriceInCents;
    }

    /**
     * @notice Calculates the total MATIC required for a given number of GamesTokens.
     * @param numberOfGTs The number of GamesTokens to buy.
     * @return howMuchMatic The total amount of MATIC needed for the specified number of GamesTokens.
     */
    function getMATICForGTs(uint256 numberOfGTs) public view returns (uint256) {
        return getMATICForOneGT() * numberOfGTs;
    }

    /**
     * @notice Allows players to buy a specified number of GamesTokens.
     * @param numberOfGTs The number of GamesTokens to buy.
     */
    function buyAmountTokens(uint256 numberOfGTs) public payable onlyAllowed {
        uint256 requiredMATIC = getMATICForGTs(numberOfGTs);
        require(msg.value >= requiredMATIC, "Insufficient MATIC sent");
        minter.mint(msg.sender, numberOfGTs * TOKEN_DECIMAL_MULTIPLIER);
    }

    /**
     * @notice Allows players to buy GamesTokens based on the amount of MATIC sent.
     */
    function buyTokens() public payable onlyAllowed {
        uint256 numberOfGTs = msg.value / getMATICForOneGT();
        require(numberOfGTs > 0, "Insufficient MATIC sent");
        minter.mint(msg.sender, numberOfGTs * TOKEN_DECIMAL_MULTIPLIER);
    }

    /**
     * @notice Allows the owner to withdraw the contract balance.
     */
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @notice Allows the owner to permit a player to participate.
     * @param player The address of the player to be allowed.
     */
    function allowPlayer(address player) external onlyOwner {
        allowedPlayers[player] = true;
        emit PlayerAllowed(player);
    }

    /**
     * @notice Allows the owner to designate a gamemaster.
     * @param gamemaster The address of the gamemaster to be added.
     */
    function addGamemaster(address gamemaster) external onlyOwner {
        // TODO: Verify this change. The struct was altered to include a registered boolean.
        gamemasters[gamemaster].registered = true;
        emit GamemasterAdded(gamemaster);
    }

    /**
     * @notice Creates a proposal for changing the token price.
     * @param newPrice The new price for the token in cents.
     */
    function createProposal(uint256 newPrice) external onlyAllowed {
        require(proposal.deadline == 0 || block.timestamp > proposal.deadline, "Previous proposal still active");

        proposal.newPrice = newPrice;
        proposal.votesFor = 0;
        proposal.votesAgainst = 0;
        proposal.deadline = block.timestamp + 1 weeks;
        proposal.executed = false;

        emit ProposalCreated(newPrice, 0, "", proposal.deadline, ProposalType.CHANGE_PRICE);
    }

    /**
     * @notice Allows allowed users to vote on the active proposal.
     * @param voteFor True to vote in favor, false to vote against.
     */
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

    /**
     * @notice Executes the proposal if voting is complete and conditions are met.
     */
    function executeProposal() external onlyAllowed {
        require(block.timestamp > proposal.deadline, "Voting period not ended yet");
        require(!proposal.executed, "Proposal already executed");
        if (proposal.votesFor > proposal.votesAgainst) {
            gamesTokenPriceInCents = proposal.newPrice;

            // TODO: This should be updated to include the amount, catchphrase and extract the corresponding ProposalType.
            emit ProposalExecuted(proposal.newPrice, 0, "", ProposalType.CHANGE_PRICE);
        }
        proposal.executed = true;
    }

/**
 * @notice Allows a player to update their catchphrase.
 * @param catchphrase The new catchphrase for the player.
 */
    function updatePlayerCatchphrase(string calldata catchphrase) external onlyRole(PLAYER_ROLE) {
        players[msg.sender].catchphrase = catchphrase;
        emit PlayerCatchphraseUpdated(msg.sender, catchphrase);
    }

/**
 * @notice Allows a gamemaster to update their catchphrase.
 * @param catchphrase The new catchphrase for the gamemaster.
 */
    function updateGamemasterCatchphrase(string calldata catchphrase) external onlyRole(GAMEMASTER_ROLE) {
        gamemasters[msg.sender].catchphrase = catchphrase;
        emit GamemasterCatchphraseUpdated(msg.sender, catchphrase);
    }

/**
 * @notice Allows a gamemaster to update their style prompt.
 * @param stylePrompt The new style prompt for the gamemaster.
 */
    function updateGamemasterStylePrompt(string calldata stylePrompt) external onlyRole(GAMEMASTER_ROLE) {
        gamemasters[msg.sender].stylePrompt = stylePrompt;
        emit GamemasterStylePromptUpdated(msg.sender, stylePrompt);
    }
}