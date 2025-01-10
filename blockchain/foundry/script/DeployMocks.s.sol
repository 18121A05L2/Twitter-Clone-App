// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Constants} from "../src/interfaces/Constants.sol";
import {MockV3Aggregator} from "@chainlink/contracts/src/v0.8/tests/MockV3Aggregator.sol";
import {console} from "forge-std/console.sol";

contract DeployMocks is Script, Constants {
    function run() external returns (MockV3Aggregator) {
        vm.startBroadcast();
        MockV3Aggregator mockV3Aggregator = new MockV3Aggregator(DECIMALS, INITIAL_ANSWER);
        vm.stopBroadcast();
        return mockV3Aggregator;
    }
}
