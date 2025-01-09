// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {TwitterProxy} from "../src/TwitterProxy.sol";
import {Twitter} from "../src/Twitter.sol";
import {Constants} from "../src/interfaces/Constants.sol";

contract DeployProxy is Script, Constants {
    function run() external {
        vm.startBroadcast(REAL_ACCOUNT);
        TwitterProxy twitterProxy = new TwitterProxy();
        // twitterProxy.initialize(REAL_ACCOUNT);
        vm.stopBroadcast();
    }
}
