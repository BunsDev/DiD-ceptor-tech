// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/ICCGateway.sol';
import {ICCGatewayClient} from './interfaces/ICCGatewayClient.sol';

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract CCGateway is ICCGateway, FunctionsClient, AccessControl {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant CLIENT_ROLE = keccak256("CLIENT_ROLE");
    bytes32 private _donId; // DON ID for the Functions DON to which the requests are sent

    mapping(uint64 subscriptionId => CCGRequest) private _requests; // Each subscription can only handle one kind of request
    mapping(bytes32 requestId => ICCGatewayClient.CCGResponse) private unprocessed_responses; // Responses that have not been processed yet

    // array of registered subscriptions
    uint64[] public subscriptions;

    constructor(address router, bytes32 initialDonId, address initialOwner) FunctionsClient(router) {
        _donId = initialDonId;

        address to = address(0) == initialOwner ? _msgSender() : initialOwner;
        _grantRole(DEFAULT_ADMIN_ROLE, to);
        _grantRole(MANAGER_ROLE, to);
    }

    /**
     * @dev Set the DON ID
     * @param newDonId New DON ID
     */
    function setDonId(bytes32 newDonId) external onlyRole(getRoleAdmin(MANAGER_ROLE)) {
        _donId = newDonId;
    }

    /**
     * @dev Get the DON ID
     * @return DON ID
     */
    function donId() external view returns (bytes32) {
        return _donId;
    }

    function registerRequest(
        uint64 subscriptionId,
        FunctionsRequest.Location codeLocation,
        string calldata source,
        FunctionsRequest.Location secretsLocation,
        bytes calldata encryptedSecretsReference,
        uint32 callbackGasLimit,
        string calldata name
    ) external onlyManager {
        if (bytes(name).length == 0) {revert CCGRequestNameEmpty();}

        CCGRequest storage req = _requests[subscriptionId];
        if(bytes(req.name).length == 0) {subscriptions.push(subscriptionId);}

        req.name = name;
        req.callbackGasLimit = callbackGasLimit;

        // Only JavaScript is supported for now
        req.config.language = FunctionsRequest.CodeLanguage.JavaScript;
        req.config.codeLocation = codeLocation;
        req.config.source = source;
        req.config.secretsLocation = secretsLocation;
        req.config.encryptedSecretsReference = encryptedSecretsReference;
    }

    function removeRequest(uint64 subscriptionId) external onlyManager {
        if (bytes(_requests[subscriptionId].name).length == 0) {revert CCGRequestNotRegistered(subscriptionId);}
        delete _requests[subscriptionId];

        // Find the index of the subscriptionId in the subscriptions array
        uint256 index = subscriptions.length;
        for (uint256 i = 0; i < subscriptions.length; i++) {
            if (index == subscriptions.length && subscriptions[i] == subscriptionId) index = i;
            if (index != subscriptions.length && i + 1 < subscriptions.length) subscriptions[i] = subscriptions[i + 1];
        }

        subscriptions.pop();
    }

    function getRequest(uint64 subscriptionId) external view returns (CCGRequest memory) {
        if (bytes(_requests[subscriptionId].name).length == 0) {revert CCGRequestNotRegistered(subscriptionId);}
        return _requests[subscriptionId];
    }
// ---------------------------------------------------------------------------------------------------------------------
    modifier onlySource(bytes32 requestId) {
        if (unprocessed_responses[requestId].source != _msgSender()) {revert CCGOnlySameSourceAllowed(requestId);}
        _;
    }

    modifier onlyManager() {
        if (!hasRole(MANAGER_ROLE, tx.origin)) {revert CCGOnlyManagerAllowed();}
        _;
    }
// ---------------------------------------------------------------------------------------------------------------------
    /**
     * @notice Triggers an on-demand Functions request using remote encrypted secrets
     * @param subscriptionId Subscription ID used to pay for request (FunctionsConsumer contract address must first be added to the subscription)
     * @param args String arguments passed into the source code and accessible via the global variable `args`
     * @param bytesArgs Bytes arguments passed into the source code and accessible via the global variable `bytesArgs` as hex strings
     * @param encryptedSecretsReference Reference pointing to encrypted secrets
     */
    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args,
        bytes[] calldata bytesArgs,
        bytes calldata encryptedSecretsReference
    ) external onlyRole(CLIENT_ROLE) returns (bytes32 requestId) {
        CCGRequest storage request = _requests[subscriptionId];
        if (bytes(request.name).length == 0) {revert CCGRequestNotRegistered(subscriptionId);}

        FunctionsRequest.Request memory req = request.config;
        req.initializeRequest(req.codeLocation, FunctionsRequest.CodeLanguage.JavaScript, req.source);
        if (encryptedSecretsReference.length > 0) {req.encryptedSecretsReference = encryptedSecretsReference;}

        if (args.length > 0) {
            req.setArgs(args);
        }
        if (bytesArgs.length > 0) {
            req.setBytesArgs(bytesArgs);
        }

        requestId = _sendRequest(req.encodeCBOR(), subscriptionId, request.callbackGasLimit, _donId);
        unprocessed_responses[requestId].state = ICCGatewayClient.CCGResponseState.Sent;
        unprocessed_responses[requestId].source = _msgSender();
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        ICCGatewayClient.CCGResponse storage resp = unprocessed_responses[requestId];
        if (resp.state != ICCGatewayClient.CCGResponseState.Sent) {revert CCGRequestAlreadyFulfilled(requestId);}

        unprocessed_responses[requestId].state = err.length > 0 ? ICCGatewayClient.CCGResponseState.Error : ICCGatewayClient.CCGResponseState.Success;
        unprocessed_responses[requestId].data = response;
        unprocessed_responses[requestId].error = err;

        ICCGatewayClient(resp.source).callback(requestId);
    }

    /**
     * @dev Get the response data
     * @param requestId The request ID, returned by sendRequest()
     * @return response CCGResponse
     */
    function getResponse(bytes32 requestId, bool remove) external onlySource(requestId) returns (ICCGatewayClient.CCGResponse memory response) {
        response = unprocessed_responses[requestId];
        if (remove) {delete unprocessed_responses[requestId];}
    }
}