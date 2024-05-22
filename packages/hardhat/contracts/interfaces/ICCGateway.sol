// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ICCGatewayClient} from './ICCGatewayClient.sol';
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_3_0/FunctionsClient.sol";

interface ICCGateway {
    struct CCGRequest {
        string name;
        uint32 callbackGasLimit;
        FunctionsRequest.Request config;
    }

    /**
     * @dev Can't register a request with an empty name
     */
    error CCGRequestNameEmpty();

    /**
     * @dev Only the same source of the requestId is allowed to call the function
     */
    error CCGOnlySameSourceAllowed(bytes32 requestId);

    /**
     * @dev Only a registered subscriptionId is allowed to call the function
     */
    error CCGRequestNotRegistered(uint64 subscriptionId);

    /**
     * @dev Can't fulfill a request that has already been fulfilled
     */
    error CCGRequestAlreadyFulfilled(bytes32 requestId);

    /**
     * @dev Only A manager can call the function
     */
    error CCGOnlyManagerAllowed();

    /**
     * @dev Send a request to the Functions DON
     */
    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args,
        bytes[] calldata bytesArgs,
        bytes calldata encryptedSecretsReference
    ) external returns (bytes32 requestId);

    function getResponse(bytes32 requestId, bool remove) external returns (ICCGatewayClient.CCGResponse memory resp);
}
