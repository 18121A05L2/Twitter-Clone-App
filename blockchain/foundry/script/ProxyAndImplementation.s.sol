// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {TwitterProxy} from "../src/TwitterProxy.sol";
import {Twitter} from "../src/Twitter.sol";
import {Constants} from "../src/interfaces/Constants.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

contract DeployProxyAndImplementation is Script, Constants {
    function run() external returns (Twitter, TwitterProxy) {
        vm.startBroadcast();
        Twitter twitter = new Twitter();
        address priceFeed = DevOpsTools.get_most_recent_deployment("MockV3Aggregator", block.chainid);
        bytes memory initializationData = abi.encodeCall(Twitter.__Twitter_init, (REAL_ACCOUNT, priceFeed));
        TwitterProxy twitterProxy = new TwitterProxy(address(twitter), initializationData);
        vm.stopBroadcast();

        return (twitter, twitterProxy);
    }
}
