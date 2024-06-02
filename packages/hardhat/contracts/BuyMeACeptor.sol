// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./GamesToken.sol";


/**
 * @title World
 * @dev World struct
 */
struct World {
    string vibe;
    string gameMasterName;
    string gameMasterTwitterHandle;
    string description;
    uint256 time;
    address gameMasterAddress;
}

/**
 * @title BuyMeACeptorWorld
 * @dev BuyMeACeptorWorld contract to accept donations and for our users to create a world for us
 */
contract BuyMeACeptor{
        address payable public owner;
    uint256 public price;
    World[] public worlds;

    GamesToken public gamesToken;

    error InsufficientFunds();
    error InvalidArguments(string message);
    error OnlyOwner();

    event BuyMeACeptorWorldEvent(address indexed buyer, uint256 price);
    event NewWorld(address indexed gameMasterAddress, uint256 time, string vibe, string gameMasterName, string gameMasterTwitterHandle, string description);

    constructor(address _gamesToken) {
        owner = payable(msg.sender);
        price = 10 * 10**18; // 10 gamesTokens
        gamesToken = GamesToken(_gamesToken);
    }

    /**
     * WRITE FUNCTIONS *************
     */

    /**
     * @dev Function to buy a world
     * @param  gameMasterName The name of the game master
     * @param  gameMasterTwitterHandle The Twitter handle of the game master
     * @param  description The description of the world
     * (Note: Using calldata for gas efficiency)
     */
    function buyWorld(string calldata vibe, string calldata gameMasterName, string calldata gameMasterTwitterHandle, string calldata description) public payable {
        if (msg.value < price) {
            revert InsufficientFunds();
        }

        emit BuyMeACeptorWorldEvent(msg.sender, msg.value);

        if (bytes(gameMasterName).length == 0 && bytes(description).length == 0) {
            revert InvalidArguments("Invalid gameMasterName or description");
        }

        worlds.push(World(vibe, gameMasterName, gameMasterTwitterHandle, description, block.timestamp, msg.sender));

        emit NewWorld(msg.sender, block.timestamp, vibe, gameMasterName, gameMasterTwitterHandle, description);
    }

    /**
     * @dev Function to remove a world
     * @param  index The index of the world
     */
    function removeWorld(uint256 index) public {
        if (index >= worlds.length) {
            revert InvalidArguments("Invalid index");
        }

        World memory world = worlds[index];

        // if operation isnt sent from the same game master or the owner, then not allowed
        if (world.gameMasterAddress != msg.sender && msg.sender != owner) {
            revert InvalidArguments("Operation not allowed");
        }

        World memory indexWorld = worlds[index];
        worlds[index] = worlds[worlds.length - 1];
        worlds[worlds.length - 1] = indexWorld;
        worlds.pop();
    }

    /**
     * @dev Function to modify a world description
     * @param  index The index of the world
     * @param  description The description of the world
     */
    function modifyWorldDescription(uint256 index, string memory description) public {
        if (index >= worlds.length) {
            revert InvalidArguments("Invalid index");
        }

        World memory world = worlds[index];

        if (world.gameMasterAddress != msg.sender || msg.sender != owner) {
            revert InvalidArguments("Operation not allowed");
        }

        worlds[index].description = description;
    }

    /**
     * @dev Function to withdraw the balance
     */
    function withdrawTips() public {
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
     * READ FUNCTIONS *************
     */

    /**
     * @dev Function to get the worlds
     */
    function getWorlds() public view returns (World[] memory) {
        return worlds;
    }

    /**
     * @dev Recieve function to accept ether
     */
    receive() external payable {}
}
