// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {SmartWallet} from "../src/Ethereum/SmartWallet.sol";
import {HelperConfig} from "./HelperConfig.sol";

contract DeploySmartWallet is Script {
    HelperConfig.NetworkConfig activeNetworkConfig;

    function run() public returns (SmartWallet accountAbstraction, HelperConfig helperConfig) {
        helperConfig = new HelperConfig();
        (address account, address entryPoint,) = helperConfig.activeNetworkConfig();
        vm.startBroadcast(account);
        accountAbstraction = new SmartWallet(entryPoint);
        vm.stopBroadcast();
    }
}
