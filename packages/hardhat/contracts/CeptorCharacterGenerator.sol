// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

contract DnDCharacterGenerator is VRFConsumerBaseV2, ConfirmedOwner {
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId;
    bytes32 keyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    // forge-test gas report & gas limit plugin on hardhat
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 7; // 6 ability scores + 1 for class

    struct Character {
        uint256[6] abilities;
        string class;
        string name;
        string alignment;
        string background;
        uint8 swaps;
    }

    mapping(uint256 => address) requestToSender;
    mapping(address => Character) public characters;

    event CharacterCreated(address owner, uint256 requestId);
    event CharacterUpdated(address owner, string name, string alignment, string background);
    event ScoresSwapped(address owner);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625)
    ConfirmedOwner(msg.sender) {
        COORDINATOR = VRFCoordinatorV2Interface(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625);
        s_subscriptionId = subscriptionId;
    }

    function createCharacter() external onlyOwner {
        require(characters[msg.sender].abilities[0] == 0, "Character already created");
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        requestToSender[requestId] = msg.sender;
        emit CharacterCreated(msg.sender, requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address owner = requestToSender[requestId];
        uint256[6] memory abilities;
        for (uint i = 0; i < 6; ++i) {  // ++i saves 2 gas
            abilities[i] = (randomWords[i] % 16) + 3; // Score range: 3-18
        }
        characters[owner] = Character({
            abilities: abilities,
            class: getClass(randomWords[6]),
            name: "",
            alignment: "",
            background: "",
            swaps: 0
        });
        emit RequestFulfilled(requestId, randomWords);
    }

    function updateCharacterDetails(string calldata name, string calldata alignment, string calldata background) external {
        require(characters[msg.sender].abilities[0] != 0, "Character not created");
        characters[msg.sender].name = name;
        characters[msg.sender].alignment = alignment;
        characters[msg.sender].background = background;
        emit CharacterUpdated(msg.sender, name, alignment, background);
    }

    function swapScores(uint8 index1, uint8 index2) external {
        require(characters[msg.sender].swaps < 3, "Max swaps reached");
        require(index1 < 6 && index2 < 6, "Invalid index");

        (characters[msg.sender].abilities[index1], characters[msg.sender].abilities[index2]) = 
            (characters[msg.sender].abilities[index2], characters[msg.sender].abilities[index1]);
        characters[msg.sender].swaps++;
        emit ScoresSwapped(msg.sender);
    }

    function getClass(uint256 randomNumber) private pure returns (string memory) {
        string[12] memory classes = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"];
        return classes[randomNumber % classes.length];
    }
}
