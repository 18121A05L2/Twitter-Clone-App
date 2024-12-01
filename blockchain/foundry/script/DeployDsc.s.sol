// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/script.sol";
import {DecentralizedStableCoin} from "../src/DecentralizedStableCoin.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {DSCEngine} from "../src/DSCEngine.sol";
import {Constants} from "./Constants.sol";

contract DSCScript is Script {
    address[] tokenAddress;
    address[] priceFeedAddresses;

    function run() external returns (DecentralizedStableCoin, DSCEngine) {
        vm.startBroadcast();
        DecentralizedStableCoin dscContract = new DecentralizedStableCoin();
        HelperConfig helperConfig = new HelperConfig();
        address dscContractAddress = address(dscContract);
        (address wethPriceFeed, address wbtcPriceFeed, address weth, address wbtc, uint256 deployerKey) =
            helperConfig.activeNetworkConfig();

        tokenAddress.push(weth);
        tokenAddress.push(wbtc);
        priceFeedAddresses.push(wethPriceFeed);
        priceFeedAddresses.push(wbtcPriceFeed);

        DSCEngine dscEngine = new DSCEngine(tokenAddress, priceFeedAddresses, dscContractAddress);
        dscContract.transferOwnership(address(dscEngine));

        vm.stopBroadcast();

        return (dscContract, dscEngine);
    }
}
