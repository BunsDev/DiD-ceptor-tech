// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {OpenSourceRandomNames} from "./OSRN.sol";
import {OpenSourceRandomBackstory} from "./OSRB.sol";

contract CCG is VRFConsumerBaseV2Plus {
    IVRFCoordinatorV2Plus COORDINATOR;
    OpenSourceRandomNames public randomNamesContract;
    OpenSourceRandomBackstory public randomBackstoryContract;

    uint256 s_subscriptionId = 21065254117722076320750141452575268873113382931160444158709360180731175497445;
    bytes32 keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    // refactor code or use https://github.com/cgewecke/hardhat-gas-reporter 
    uint32 callbackGasLimit = 135000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 2; // 1 into 6 ability scores + 1 for class

    struct Character {
        uint256 randomWord;
        uint256[6] abilities;
        string class;
        string playerName;
        string name;
        string alignment;
        string background;
        uint8 swaps;
    }

    mapping(uint256 => address) requestToSender;
    mapping(address => Character) public characters;

    event CharacterCreated(address owner, uint256 requestId);
    event CharacterUpdated(address owner, string alignment, string background);
    event ScoresSwapped(address owner);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);
    event RandomWordSaved(address owner);
    event RandomNamesContractSet(address randomNamesContract);

    constructor() VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B)
 {
        COORDINATOR = IVRFCoordinatorV2Plus(
            0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
        );
    }

    // function to set both contracts at once
    function setRandomContracts(address _randomNamesContract, address _randomBackstoryContract) external {
        randomNamesContract = OpenSourceRandomNames(_randomNamesContract);
        randomBackstoryContract = OpenSourceRandomBackstory(_randomBackstoryContract);
        emit RandomNamesContractSet(_randomNamesContract);
    }

    function createCharacter(string calldata playerName) external {
        require(characters[msg.sender].randomWord == 0, "Character already created, use finalizeCharacterDetails");
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
        characters[msg.sender].playerName = playerName;
        requestToSender[requestId] = msg.sender;
        emit CharacterCreated(msg.sender, requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
    address owner = requestToSender[requestId];
    require(characters[owner].randomWord == 0, "Random words already fulfilled");

    characters[owner].randomWord = randomWords[0];
    characters[owner].class = getClass(randomWords[1]);

    emit RequestFulfilled(requestId, randomWords);
    emit RandomWordSaved(owner);
    }

    function finalizeCharacterDetails(string calldata alignment) external {
    require(characters[msg.sender].randomWord != 0, "Random words not fulfilled");

    uint256 randomWord = characters[msg.sender].randomWord;
    for (uint i = 0; i < 6; ++i) {
        uint256 chunk = (randomWord >> (i * 32)) & 0xFFFFFFFF; // Extract 32-bit chunks
        characters[msg.sender].abilities[i] = (chunk % 16) + 3; // Score range: 3-18
    }
    
    // mod a value between 0-19 from the random word
    uint256 randomNumber = randomWord % 20;
    characters[msg.sender].name = randomNamesContract.names(randomNumber);
    characters[msg.sender].alignment = alignment;
    randomNumber = (randomWord >> 32) % 15;
    characters[msg.sender].background = randomBackstoryContract.backstories(randomNumber);    

    emit CharacterUpdated(msg.sender, alignment, characters[msg.sender].background);
    }

    function updateCharacterDetails(string calldata name, string calldata alignment, string calldata background) external {
        require(characters[msg.sender].randomWord != 0, "Random words not fulfilled");

        if (bytes(name).length > 0) {
            characters[msg.sender].name = name;
        }
        if (bytes(alignment).length > 0) {
            characters[msg.sender].alignment = alignment;
        }
        if (bytes(background).length > 0) {
            characters[msg.sender].background = background;
        }
        emit CharacterUpdated(msg.sender, alignment, background);
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

    // because the ability scores are stored as an array, they aren't easily readable
    // this function allows us to get the ability scores of a character
    function getCharacterAbilities(address owner) external view returns (uint256[6] memory) {
        return characters[owner].abilities;
    }
}
