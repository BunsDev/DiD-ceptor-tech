// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./World.sol";

contract WorldFactory {
    address public owner;
    uint256 public priceToCreate;
    uint256 public priceToJoinGM;
    uint256 public priceToJoinPlayer;
    World[] public worlds;

    error InsufficientFunds();
    error InvalidArguments(string message);
    error OnlyOwner();

    event WorldCreated(address indexed worldCreator, address worldContract, uint256 time, string vibe, string gameMasterName, string gameMasterTwitterHandle, string description);
    event PlayerJoinedWorld(address indexed worldContract, address player);
    event GameScheduled(address indexed worldContract, uint256 gameId, address gameMaster, uint256 startTime, uint256 endTime);
    event GameStarted(address indexed worldContract, uint256 gameId);
    event GameJoined(address indexed worldContract, uint256 gameId, address player);
    event GameLeft(address indexed worldContract, uint256 gameId, address player);
    event GameReviewed(address indexed worldContract, uint256 gameId, address reviewer);

    constructor() {
        owner = msg.sender;
        priceToCreate = .1 ether;   // Example price to create a world
        priceToJoinGM = .05 ether;    // Example price for GM to join a world
        priceToJoinPlayer = .02 ether; // Example price for player to join a world
    }

    /**
     * @dev Function to create a world
     * @param vibe The vibe of the world
     * @param gameMasterName The name of the game master
     * @param gameMasterTwitterHandle The Twitter handle of the game master
     * @param description The description of the world
     */
    function createWorld(
        string calldata vibe,
        string calldata gameMasterName,
        string calldata gameMasterTwitterHandle,
        string calldata description
    ) public payable {
        if (msg.value < priceToCreate) {
            revert InsufficientFunds();
        }

        World world = new World(vibe, gameMasterName, gameMasterTwitterHandle, description, msg.sender);
        worlds.push(world);

        emit WorldCreated(msg.sender, address(world), block.timestamp, vibe, gameMasterName, gameMasterTwitterHandle, description);
    }

    /**
     * @dev Function for a GM to join a world
     * @param worldIndex The index of the world to join
     */
    function joinWorldAsGM(uint256 worldIndex) public payable {
        if (worldIndex >= worlds.length) {
            revert InvalidArguments("World does not exist");
        }
        if (msg.value < priceToJoinGM) {
            revert InsufficientFunds();
        }

        World world = worlds[worldIndex];
        payable(world.worldCreator()).transfer(priceToJoinGM / 2);
        payable(address(world)).transfer(priceToJoinGM / 2);

        emit PlayerJoinedWorld(address(world), msg.sender);
    }

    /**
     * @dev Function for a player to join a world
     * @param worldIndex The index of the world to join
     */
    function joinWorldAsPlayer(uint256 worldIndex) public payable {
        if (worldIndex >= worlds.length) {
            revert InvalidArguments("World does not exist");
        }
        if (msg.value < priceToJoinPlayer) {
            revert InsufficientFunds();
        }

        World world = worlds[worldIndex];
        payable(world.worldCreator()).transfer(priceToJoinPlayer / 2);
        payable(address(world)).transfer(priceToJoinPlayer / 2);

        emit PlayerJoinedWorld(address(world), msg.sender);
    }

    /**
     * @dev Function to withdraw the balance
     */
    function withdrawFunds() public {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }

        if (address(this).balance == 0) {
            revert InsufficientFunds();
        }

        (bool sent,) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    /**
     * @dev Function to get the worlds
     */
    function getWorlds() public view returns (World[] memory) {
        return worlds;
    }

    /**
     * @dev Receive function to accept ether
     */
    receive() external payable {}
}
