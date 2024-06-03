// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ICCGatewayClient} from "./interfaces/ICCGatewayClient.sol";
import {ICCGateway} from "./interfaces/ICCGateway.sol";
import {Backgrounds} from "./Characters/Backgrounds.sol";

contract BackstoryFunctionClient is ICCGatewayClient {
    ICCGateway private immutable gateway;

    uint64 public subscriptionId = 0;
    bytes private encryptedSecretsReference = "";
    mapping(address => string) public backstory;

    event ResponseReceived(uint64 subscriptionId, bytes32 requestId, string response);
    event ErrorReceived(uint64 subscriptionId, bytes32 requestId, string error);

    constructor(address gatewayAddress) {
        gateway = ICCGateway(gatewayAddress);
    }

    function updateSubscriptionId(uint64 _subscriptionId) external {
        subscriptionId = _subscriptionId;
    }

    function updateEncryptedSecretsReference(bytes calldata _encryptedSecretsReference) external {
        encryptedSecretsReference = _encryptedSecretsReference;
    }

    function request(string calldata characterClass, string calldata characterRace, string calldata characterName, string calldata background) external {
        require(subscriptionId != 0, "Subscription ID not set");

        string[] memory args = new string[](4);
        args[0] = characterClass;
        args[1] = characterRace;
        args[2] = characterName;
        args[3] = background;

        bytes[] memory bytesArgs = new bytes[](0); // No bytes arguments for this function

        gateway.sendRequest(subscriptionId, args, bytesArgs, encryptedSecretsReference);
    }

    function callback(bytes32 requestId) external override {
        ICCGatewayClient.CCGResponse memory response = gateway.getResponse(requestId, true);

        if (response.state == ICCGatewayClient.CCGResponseState.Success) {
            backstory[msg.sender] = string(response.data);
            emit ResponseReceived(response.subscriptionId, requestId, string(response.data));
        } else {
            emit ErrorReceived(response.subscriptionId, requestId, string(response.error));
        }
    }
}
