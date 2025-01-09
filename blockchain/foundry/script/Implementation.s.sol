pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Twitter} from "../src/Twitter.sol";
import {Constants} from "../src/interfaces/Constants.sol";

contract DeployImplementation is Script, Constants {
    function run() external {
        vm.startBroadcast();
        vm.startPrank(REAL_ACCOUNT);
        new Twitter();
        vm.stopBroadcast();
    }
}
