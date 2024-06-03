// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ICCGatewayClient} from "../interfaces/ICCGatewayClient.sol";
import {ICCGateway} from "../interfaces/ICCGateway.sol";
import {Backgrounds} from "../Characters/Backgrounds.sol";

contract BackstoryFunctionClient is ICCGatewayClient {
    ICCGateway private immutable gateway;

    uint64 public BACKSTORY_ENDPOINT = 0;
    uint64 public ART_ALT_ENDPOINT = 0;
    mapping(address => string) public backstory;
    mapping(address => string) public altArt;

    // We need to store the request ID to the sender address because the callback function is called by the gateway/chainlink.
    mapping(bytes32 => address) private requests;

    constructor(address gatewayAddress) {
        gateway = ICCGateway(gatewayAddress);
    }

    function setBackstoryEndpoint(uint64 _subscriptionId) external {
        BACKSTORY_ENDPOINT = _subscriptionId;
    }

    function setArtAltEndpoint(uint64 _subscriptionId) external {
        ART_ALT_ENDPOINT = _subscriptionId;
    }

    // CLASS --------------> |  Wizard
    // RACE --------------> |   Elf
    // NAME --------------> |   Eldon
    function generateBackstory(string calldata characterClass, string calldata characterRace, string calldata characterName, string calldata background) external {
        require(BACKSTORY_ENDPOINT != 0, "Backstory Endpoint ID not set");

        string[] memory args = new string[](4);
        args[0] = characterClass;
        args[1] = characterRace;
        args[2] = characterName;
        args[3] = background;

        bytes[] memory bytesArgs = new bytes[](0); // No bytes arguments for this function

        bytes32 requestId = gateway.sendRequest(BACKSTORY_ENDPOINT, args, bytesArgs, "");
        requests[requestId] = msg.sender;
    }

    function handleBackstoryResponse(ICCGatewayClient.CCGResponse memory response, address owner) internal {
        backstory[owner] = string(response.data);
    }

    // CLASS[0] --------------> |  Wizard
    // RACE[1] --------------> |   Elf
    // NAME[2] --------------> |   Eldon
    // ALIGNMENT[3] --------------> |  Neutral Good
    // BACKGROUND[4] --------------> |  Sage
    // TRAITS[4] --------------> | Brave and kind-hearted
    // IDEALS[5] --------------> | Protect the weak
    // BONDS[6] --------------> |  Family
    // FLAWS[7] --------------> |  Trusts too easily
    function generateArtAlt(string[] calldata characterDetails) external {
        require(ART_ALT_ENDPOINT != 0, "Art Alt Endpoint ID not set");

        bytes[] memory bytesArgs = new bytes[](0); // No bytes arguments for this function

        bytes32 requestId = gateway.sendRequest(ART_ALT_ENDPOINT, characterDetails, bytesArgs, "");
        requests[requestId] = msg.sender;
    }

    function handleArtAltResponse(ICCGatewayClient.CCGResponse memory response, address owner) internal {
        altArt[owner] = string(response.data);
    }

    function callback(bytes32 requestId) external override {
        ICCGatewayClient.CCGResponse memory response = gateway.getResponse(requestId, true);
        address owner = requests[requestId];
        delete requests[requestId];

        if (response.state == ICCGatewayClient.CCGResponseState.Success) {
            if (response.subscriptionId == BACKSTORY_ENDPOINT)
                return handleBackstoryResponse(response, owner);
            if (response.subscriptionId == ART_ALT_ENDPOINT)
                return handleArtAltResponse(response, owner);
        }
    }
}
