// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ICCGatewayClient} from "./interfaces/ICCGatewayClient.sol";
import {ICCGateway} from "./interfaces/ICCGateway.sol";

contract CCExampleClient is ICCGatewayClient {
    ICCGateway private immutable gateway;

    uint64 public subscriptionId = 0;
    bytes public encryptedSecretsReference = "";

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

    function request(string[] calldata args, bytes[] calldata bytesArgs) external {
        require(subscriptionId != 0, "Subscription ID not set");

        gateway.sendRequest(subscriptionId, args, bytesArgs, encryptedSecretsReference);
    }

    function callback(bytes32 requestId) external override {
        ICCGatewayClient.CCGResponse memory response = gateway.getResponse(requestId, true);

        if (response.state == ICCGatewayClient.CCGResponseState.Success) {
            emit ResponseReceived(response.subscriptionId, requestId, string(response.data));
        } else {
            emit ErrorReceived(response.subscriptionId, requestId, string(response.error));
        }
    }
}
