// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Constants} from "../src/interfaces/Constants.sol";
import {console} from "forge-std/console.sol";
import {TwitterV2} from "../src/TwitterV2.sol";
import {Twitter} from "../src/Twitter.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";
import {TwitterProxy} from "../src/TwitterProxy.sol";
import {DeployProxyAndImplementation} from "../script/DeployProxyAndImplementation.s.sol";

contract Upgrade is Script, Constants {
    address account;

    function run() external returns (address, TwitterV2, address) {
        HelperConfig config = new HelperConfig();
        DeployProxyAndImplementation proxyAndImplementation = new DeployProxyAndImplementation();
        (, TwitterProxy twitterProxy) = proxyAndImplementation.run();
        (account,) = config.activeNetworkConfig();
        // TODO :
        // proxy = DevOpsTools.get_most_recent_deployment("TwitterProxy", block.chainid);
        vm.startBroadcast(account);
        TwitterV2 twitterV2 = new TwitterV2();
        // upgradeToAndCall(address(twitterV2), "");
        vm.stopBroadcast();
        return (address(twitterProxy), twitterV2, account);
    }

    function upgradeToAndCall(address implementation, bytes memory data, address twitterProxy, address broadcastAccount)
        public
    {
        vm.startBroadcast(broadcastAccount);
        TwitterV2(payable(address(twitterProxy))).upgradeToAndCall(implementation, data);
        vm.stopBroadcast();
    }
}
