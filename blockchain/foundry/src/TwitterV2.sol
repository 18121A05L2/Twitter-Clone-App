// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Twitter.sol";

contract TwitterV2 is Twitter {
    function getVersion() external pure virtual override returns (uint256) {
        return 2;
    }

    function __TwitterV2_init() external {}
}
