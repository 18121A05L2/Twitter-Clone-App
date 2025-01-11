// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Constants} from "../src/interfaces/Constants.sol";
import {console} from "forge-std/console.sol";
import {TwitterV2} from "../src/TwitterV2.sol";
import {Twitter} from "../src/Twitter.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

contract Upgrade is Script, Constants {
    function run() external returns (address proxy) {
        proxy = DevOpsTools.get_most_recent_deployment("TwitterProxy", block.chainid);
        // bytes memory initializationData = abi.encodeCall(TwitterV2.__TwitterV2_init, ());
        vm.startBroadcast();
        TwitterV2 twitterV2 = new TwitterV2();
        Twitter(payable(proxy)).upgradeToAndCall(address(twitterV2), "");
        vm.stopBroadcast();
    }
}
