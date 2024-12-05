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
import {Vm} from "forge-std/Vm.sol";

contract DscEngineTest is Test, Constants {
    DSCEngine dscEngine;
    DecentralizedStableCoin dsc;
    HelperConfig helperConfig;
    address public USER = makeAddr("user");
    uint256 public constant STARTING_USER_BALANCE = 20 ether;
    uint256 public constant COLLATERAL_DEPOSITED = 1 ether;
    address wethPriceFeed;
    address wbtcPriceFeed;
    address weth;
    address wbtc;

    function setUp() external {
        (dsc, dscEngine, helperConfig) = new DscScript().run();
        (wethPriceFeed, wbtcPriceFeed, weth, wbtc,) = helperConfig.activeNetworkConfig();
        ERC20Mock(weth).mint(USER, STARTING_USER_BALANCE);
    }

    address[] tokenAddresses;
    address[] priceFeedAddresses;

    // Constructor tests
    function testConstructor() external {
        tokenAddresses.push(weth);
        priceFeedAddresses.push(wethPriceFeed);
        priceFeedAddresses.push(wbtcPriceFeed);

        vm.expectRevert(DSCEngine.DSCEngine_tokenAddressMismatchToPriceFeed.selector);
        new DSCEngine(tokenAddresses, priceFeedAddresses, address(dsc));

        tokenAddresses.push(wbtc);
        new DSCEngine(tokenAddresses, priceFeedAddresses, address(dsc));

        dscEngine.getPriceFeedForCollateralToken(wbtc) == wbtcPriceFeed;
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

    function testGetTokenAmountFromUsd() external view {
        // we were testing how much is the token amount for 100 dollars
        uint256 wethTokenAmountInUsd = 100;
        uint256 expectedTokenAmount = 27027027027027027; // 100/3700 = 0.027027027027027027
        uint256 tokenAmount = dscEngine.getTokenAmountFromUsd(weth, wethTokenAmountInUsd);
        console.log("tokenAmount", tokenAmount);
        assertEq(tokenAmount, expectedTokenAmount);
    }

    function testDepositCollateralFailureScenarios() external {
        vm.startPrank(USER);
        address randAddress = makeAddr("hello");
        vm.expectRevert(DSCEngine.DSCEngine_tokenNotAllowed.selector);
        dscEngine.depositCollateral(randAddress, 1e17);

        vm.expectRevert(DSCEngine.DSCEngine_mustBeMoreThanZero.selector);
        dscEngine.depositCollateral(weth, 0);
        vm.stopPrank();
    }

    function testDepositCollateralSucceeds() public {
        vm.startPrank(USER);
        ERC20Mock(weth).approve(address(dscEngine), COLLATERAL_DEPOSITED);
        dscEngine.depositCollateral(weth, COLLATERAL_DEPOSITED);
        // vm.stopPrank();
    }

    function testMintDscForSuccess() external {
        vm.expectRevert(DSCEngine.DSCEngine_mustBeMoreThanZero.selector);
        dscEngine.mintDsc(0 ether);
        testDepositCollateralSucceeds();
        (bool success) = dscEngine.mintDsc(2775e18);
        assertEq(success, true);
    }

    function testMintDscForOverCollateralized() external {
        // reverts if user tries to mint over collateralized
        testDepositCollateralSucceeds();
        uint256 overCollateralizedAmount = 2776e18;
        uint256 userHealthFactorWhenOverCollateralized = 0;
        vm.expectRevert(
            abi.encodeWithSelector(
                DSCEngine.DSCEngine_HealthFactorIsBroken.selector, userHealthFactorWhenOverCollateralized
            )
        );
        dscEngine.mintDsc(overCollateralizedAmount);
    }

    // function testMintDscForWarningCollateralized() external {
    //     testDepositCollateralSucceeds();
    //     uint256 warningAmount = 2700e18;
    //     vm.recordLogs();
    //     dscEngine.mintDsc(warningAmount);
    //     Vm.Log[] memory memoryEntries = vm.getRecordedLogs();
    //     // need to test this effectively as we have multiple evnet emissions
    //     address nearOverCollareralWarningAddr = address(uint160(uint256(memoryEntries[1].topics[0])));
    //     assertEq(nearOverCollareralWarningAddr, USER);
    // }
}