// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {TwitterProxy} from "../src/TwitterProxy.sol";
import {DeployProxyAndImplementation} from "../script/DeployProxyAndImplementation.s.sol";
import {Constants} from "../src/interfaces/Constants.sol";
import {Twitter} from "../src/Twitter.sol";
import {console} from "forge-std/console.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";

contract TestProxy is Test, Constants {
    TwitterProxy public twitterProxy;
    Twitter public twitterV1;
    address deployedWithAccount;

    function setUp() public {
        (twitterV1, twitterProxy) = new DeployProxyAndImplementation().run();
        HelperConfig config = new HelperConfig();
        (deployedWithAccount,) = config.activeNetworkConfig();
    }

    function testProxyBalance() public view {
        assertEq(address(twitterProxy).balance, INITIAL_ETH_LOADED);
    }

    function testZerothSlot() public view {
        bytes32 zerothSlot = vm.load(address(twitterProxy), 0);
        assertEq(zerothSlot, 0);
    }

    function testProxyOwner() public view {
        bytes32 ownerAddressInBytes32 = vm.load(address(twitterProxy), ADMIN_SLOT);
        address ownerAddress = address(uint160(uint256(ownerAddressInBytes32)));
        assertEq(ownerAddress, deployedWithAccount);
    }

    function testImplementationAddress() public view {
        bytes32 implementationAddressInBytes32 = vm.load(address(twitterProxy), IMPLEMENTATION_SLOT);
        address implementationAddress = address(uint160(uint256(implementationAddressInBytes32)));
        assertEq(implementationAddress, address(twitterV1));
    }

    function testVersionV1() public view {
        uint256 version = twitterV1.getVersion();
        uint256 expectedVersion = 1;
        assertEq(version, expectedVersion);
    }

    function testGetImplementation() public view {
        address implementationAddress = Twitter(payable(address(twitterProxy))).getImplementation();
        assertEq(implementationAddress, address(twitterV1));
    }
}
