// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {TwitterProxy} from "../src/TwitterProxy.sol";
import {Twitter} from "../src/Twitter.sol";
import {Constants} from "../src/interfaces/Constants.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";
import {console} from "forge-std/console.sol";

contract DeployProxyAndImplementation is Script, Constants {
    function run() external returns (Twitter, TwitterProxy) {
        HelperConfig config = new HelperConfig();
        (address account, address priceFeed) = config.activeNetworkConfig();
        vm.startBroadcast(account);
        Twitter twitter = new Twitter();
        bytes memory initializationData = abi.encodeCall(Twitter.__Twitter_init, (account, priceFeed));
        TwitterProxy twitterProxy = new TwitterProxy{value: INITIAL_ETH_LOADED}(address(twitter), initializationData);
        vm.stopBroadcast();
        return (twitter, twitterProxy);
    }
}
