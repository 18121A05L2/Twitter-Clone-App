// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {TwitterV2} from "../src/TwitterV2.sol";
import {Upgrade} from "../script/Upgrade.s.sol";
import {console} from "forge-std/console.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";

contract TwitterV2Test is Test {
    address proxy;

    function setUp() public {
        proxy = DevOpsTools.get_most_recent_deployment("TwitterProxy", block.chainid);
        new Upgrade().run();
    }

    function testVersion() public view {
        uint256 version = TwitterV2(payable(proxy)).getVersion();  // TwitterV2 has payable fallback and whatever the address we pass to that Contract it must expect that as a payable address
        console.log("version: ", version);
        uint256 expectedVersion = 2;
        assertEq(version, expectedVersion);
    }
}
