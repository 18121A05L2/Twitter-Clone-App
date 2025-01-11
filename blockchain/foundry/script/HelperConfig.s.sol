// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Constants} from "../src/interfaces/Constants.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {Script} from "forge-std/Script.sol";
import {MockV3Aggregator} from "@chainlink/contracts/src/v0.8/tests/MockV3Aggregator.sol";

contract HelperConfig is Constants, Script {
    struct NetworkConfig {
        address account;
        address priceFeed;
    }

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == ANVIL_CHAIN_ID) {
            activeNetworkConfig = getOrCreateEthAnvilConfig();
        } else if (block.chainid == SEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getSepoliaEthConfig();
        }
    }

    function getSepoliaEthConfig() public returns (NetworkConfig memory sepoliaNetworkConfig) {
        vm.deal(REAL_ACCOUNT, 1000 ether);
        sepoliaNetworkConfig = NetworkConfig({account: REAL_ACCOUNT, priceFeed: SEPOLIA_PRICE_FEED});
        return sepoliaNetworkConfig;
    }

    function getOrCreateEthAnvilConfig() public returns (NetworkConfig memory anvilNetworkConfig) {
        if (activeNetworkConfig.account != address(0)) {
            return activeNetworkConfig;
        }
        vm.deal(ANVIL_ACCOUNT, 1000 ether);
        vm.startBroadcast(ANVIL_ACCOUNT);
        MockV3Aggregator mockV3Aggregator = new MockV3Aggregator(DECIMALS, INITIAL_ANSWER);
        vm.stopBroadcast();
        anvilNetworkConfig = NetworkConfig({account: ANVIL_ACCOUNT, priceFeed: address(mockV3Aggregator)});
        return anvilNetworkConfig;
    }
}
