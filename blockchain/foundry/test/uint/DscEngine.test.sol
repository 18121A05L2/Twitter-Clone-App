// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {DSCEngine} from "../../src/DSCEngine.sol";
import {DecentralizedStableCoin} from "../../src/DecentralizedStableCoin.sol";
import {DscScript} from "../../script/DeployDsc.s.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Constants} from "../../script/Constants.c.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract DscEngineTest is Test, Constants {
    DSCEngine dscEngine;
    DecentralizedStableCoin dsc;
    HelperConfig helperConfig;
    address public USER = makeAddr("user");
    address wethPriceFeed;
    address wbtcPriceFeed;
    address weth;
    address wbtc;

    function setUp() external {
        (dsc, dscEngine, helperConfig) = new DscScript().run();
        (wethPriceFeed, wbtcPriceFeed, weth, wbtc,) = helperConfig.activeNetworkConfig();
        ERC20Mock(weth).mint(USER, 20 ether);
    }

    function testGetUsdValueForEth() external view {
        uint256 ethAmount = 1e18;
        uint256 expectedEthValueInUsd = 3700e18;
        uint256 usdValue = dscEngine.getUsdValue(weth, ethAmount);
        assertEq(usdValue, expectedEthValueInUsd);

        uint256 ethAmountRand = 3e16;
        uint256 expectedEthValueInUsdRand = 111e18;
        uint256 usdValueRand = dscEngine.getUsdValue(weth, ethAmountRand);
        console.log(usdValueRand);
        assertEq(usdValueRand, expectedEthValueInUsdRand);
    }

    function testGetUsdValueForBtc() external view {
        uint256 wbtcAmount = 1e18;
        uint256 expectedWbtcValueInUsd = 97000e18;
        uint256 usdValueWbtc = dscEngine.getUsdValue(wbtc, wbtcAmount);
        assertEq(usdValueWbtc, expectedWbtcValueInUsd);
    }

    function testDepositCollateralFailureScenarios() external {
        vm.startPrank(USER);
        address randAddress = makeAddr("hello");
        vm.expectRevert(DSCEngine.DSCEngine_tokenNotAllowed.selector);
        dscEngine.depositCollateral(randAddress, 1e17);

        vm.expectRevert(DSCEngine.DSCEngine_mustBeMoreThanZero.selector);
        dscEngine.depositCollateral(weth, 0);
    }
}
