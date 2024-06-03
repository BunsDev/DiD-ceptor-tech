// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {CCExampleClient} from "../CCExampleClient.sol";

contract CCNotificationClient is CCExampleClient {
    constructor(address gatewayAddress) CCExampleClient(gatewayAddress) {}
}
