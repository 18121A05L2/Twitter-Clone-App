// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {ERC1967Utils} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";

/**
 * @title Follows ERC-1822: Universal Upgradeable Proxy Standard (UUPS)
 * @author LakshmiSanikommu
 * @notice This follows ERC1967 : Proxy Storage Slots
 * @dev If this exceeds the Limit of 24kb for Twitter contract we will implement a diamond proxy pattern contract - https://eips.ethereum.org/EIPS/eip-2535#reference-implementation
 */
contract TwitterProxy is ERC1967Proxy {
    constructor(address implementation, bytes memory _data) payable ERC1967Proxy(implementation, _data) {
        // TODO : need to check where and how we can use this or are we going to use openzepplin owanable one
        ERC1967Utils.changeAdmin(msg.sender);
    }
}

// Implementation Storage slot - bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)
// Admin address slot - bytes32(uint256(keccak256('eip1967.proxy.admin')) - 1)

// Helful Docs
// https://docs.openzeppelin.com/upgrades-plugins/writing-upgradeable#modifying-your-contracts
// https://eips.ethereum.org/EIPS/eip-1967
// https://eips.ethereum.org/EIPS/eip-1822
