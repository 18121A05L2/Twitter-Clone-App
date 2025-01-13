// SPDX-License-identifier: MIT

pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {DeployProxyAndImplementation} from "../script/DeployProxyAndImplementation.s.sol";
import {Twitter} from "../src/Twitter.sol";
import {TwitterProxy} from "../src/TwitterProxy.sol";
import {Constants} from "../src/interfaces/Constants.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestTwitterUsingProxy is Test, Constants {
    Twitter twitterProxy;

    function setUp() public {
        DeployProxyAndImplementation proxyAndImplementation = new DeployProxyAndImplementation();
        (, TwitterProxy proxy) = proxyAndImplementation.run();
        twitterProxy = Twitter(payable(address(proxy)));
    }

    function testErc165() public view {
        bytes4 erc20InterfaceIdentifier = type(IERC20).interfaceId;
        bool result = twitterProxy.supportsInterface(erc20InterfaceIdentifier);
        assertEq(result, true);
    }
}
