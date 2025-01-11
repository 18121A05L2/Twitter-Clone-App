// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Constants} from "../src/interfaces/Constants.sol";
import {console} from "forge-std/console.sol";
import {TwitterV2} from "../src/TwitterV2.sol";
import {Twitter} from "../src/Twitter.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";

contract Upgrade is Script, Constants {
    function run() external returns (address proxy) {
        HelperConfig config = new HelperConfig();
        (address account,) = config.activeNetworkConfig();

        proxy = DevOpsTools.get_most_recent_deployment("TwitterProxy", block.chainid);
        vm.startBroadcast(account);
        TwitterV2 twitterV2 = new TwitterV2();
        TwitterV2(payable(proxy)).upgradeToAndCall(address(twitterV2), "");
        vm.stopBroadcast();
    }
}
