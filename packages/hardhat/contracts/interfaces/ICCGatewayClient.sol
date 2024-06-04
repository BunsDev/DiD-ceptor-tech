// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface ICCGatewayClient {
    enum CCGResponseState {Sent, Success, Error}

    struct CCGResponse {
        uint64 subscriptionId;
        address source;
        CCGResponseState state;
        bytes data;
        bytes error;
    }

    function callback(bytes32 requestId) external;
}
