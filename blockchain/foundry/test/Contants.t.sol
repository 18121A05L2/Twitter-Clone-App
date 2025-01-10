// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Constants} from "../src/interfaces/Constants.sol";
import {Test} from "forge-std/Test.sol";

contract TestConstants is Constants, Test {
    function testConstants() external pure {
        bytes32 IMPLEMENTATION_SLOT_VALUE = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
        bytes32 ADMIN_SLOT_VALUE = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;
        assertEq(IMPLEMENTATION_SLOT, IMPLEMENTATION_SLOT_VALUE);
        assertEq(ADMIN_SLOT, ADMIN_SLOT_VALUE);
    }
}
