// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract CeptorCharacterGenerator is VRFConsumerBaseV2Plus {
    IVRFCoordinatorV2Plus COORDINATOR;
    uint256 s_subscriptionId;
    bytes32 keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
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

    constructor(uint256 subscriptionId) VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B)
 {
        COORDINATOR = IVRFCoordinatorV2Plus(
            0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
        );
        s_subscriptionId = subscriptionId;
    }

    // allow any address to call createCharacter, 
    // require each address can create one character
    // (after a character is created, 
    // characters[msg.sender].abilities[0] will no longer be 0).
    function createCharacter() external {
    require(characters[msg.sender].abilities[0] == 0, "Character already created");
    uint256 requestId = COORDINATOR.requestRandomWords(
        VRFV2PlusClient.RandomWordsRequest({
            keyHash: keyHash,
            subId: s_subscriptionId,
            requestConfirmations: requestConfirmations,
            callbackGasLimit: callbackGasLimit,
            numWords: numWords,
            extraArgs: VRFV2PlusClient._argsToBytes(
                VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
            )
        })
    );
    requestToSender[requestId] = msg.sender;
    emit CharacterCreated(msg.sender, requestId);
}
    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
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
        string[13] memory classes = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard", "Ceptor"];
        return classes[randomNumber % classes.length];
    }
}
