// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {TwitterV2} from "../src/TwitterV2.sol";
import {Upgrade} from "../script/Upgrade.s.sol";
import {console} from "forge-std/console.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract TwitterV2Test is Test {
    address proxy;
    TwitterV2 twitterV2;
    Upgrade upgrade;
    address account;
    address randomUser = makeAddr("randomUser");

    function setUp() public {
        // TODO : need to check whether do i need to used the existing deployed one or new one
        // proxy = DevOpsTools.get_most_recent_deployment("TwitterProxy", block.chainid);
        upgrade = new Upgrade();
        (proxy, twitterV2, account) = upgrade.run();
    }

    function testBeforeUpgrade() public view {
        uint256 version = TwitterV2(payable(proxy)).getVersion();
        uint256 expectedVersion = 1;
        assertEq(version, expectedVersion);
    }

    function testUpgradedVersion() public {
        upgrade.upgradeToAndCall(address(twitterV2), "", proxy, account);
        uint256 version = TwitterV2(payable(proxy)).getVersion(); // TwitterV2 has payable fallback and whatever the address we pass to that Contract it must expect that as a payable address
        uint256 expectedVersion = 2;
        assertEq(version, expectedVersion);
    }

    function testOwnership() public {
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, randomUser));
        upgrade.upgradeToAndCall(address(twitterV2), "", proxy, randomUser);
    }

    function testTransFerOwnershipAndUpgrade() public {
        vm.prank(account);
        TwitterV2(payable(proxy)).transferOwnership(randomUser);
        upgrade.upgradeToAndCall(address(twitterV2), "", proxy, randomUser);
    }
}
