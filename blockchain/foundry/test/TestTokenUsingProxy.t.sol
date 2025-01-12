// SPDX-License-identifier: MIT

pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {DeployProxyAndImplementation} from "../script/DeployProxyAndImplementation.s.sol";
import {Twitter} from "../src/Twitter.sol";
import {TwitterProxy} from "../src/TwitterProxy.sol";
import {Constants} from "../src/interfaces/Constants.sol";

contract TestImplementationUsingProxy is Test, Constants {
    // Twitter twitterV1;
    Twitter twitterProxy;
    uint256 constant INITIAL_BALANCE = 500;

    function setUp() public {
        DeployProxyAndImplementation proxyAndImplementation = new DeployProxyAndImplementation();
        (, TwitterProxy proxy) = proxyAndImplementation.run();
        twitterProxy = Twitter(payable(address(proxy)));
    }

    function testTotoalSyppy() public view {
        uint256 totalSupply = twitterProxy.totalSupply();
        uint256 expectedTotalSupply = 1000;
        assertEq(totalSupply, expectedTotalSupply);
    }

    function testBalances() public {
        vm.prank(address(twitterProxy));
        uint256 contractBalance = twitterProxy.balanceOf();
        assertEq(contractBalance, INITIAL_BALANCE);

        vm.prank(ANVIL_ACCOUNT);
        uint256 ownerBalance = twitterProxy.balanceOf();
        assertEq(ownerBalance, INITIAL_BALANCE);
    }

    function testTransfers() public {
        uint256 expectedBalance = 222;
        vm.startPrank(ANVIL_ACCOUNT);
        twitterProxy.transfer(RANDOM_ACCOUNT, expectedBalance);
        uint256 senderBalance = twitterProxy.balanceOf();
        vm.stopPrank();
        vm.prank(RANDOM_ACCOUNT);
        uint256 receiverBalance = twitterProxy.balanceOf();
        assertEq(receiverBalance, expectedBalance);
        assertEq(senderBalance, INITIAL_BALANCE - 222);
    }
}
