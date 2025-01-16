// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {DeploySmartWallet} from "../script/DeploySmartWallet.sol";
import {HelperConfig} from "../script/HelperConfig.sol";
import {SmartWallet} from "../src/Ethereum/SmartWallet.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {SendPackedUserOps} from "../script/SendPackedUserOps.sol";
import {PackedUserOperation} from "lib/account-abstraction/contracts/interfaces/PackedUserOperation.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IEntryPoint} from "lib/account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {console} from "forge-std/console.sol";

contract TestSmartWallet is Test {
    address account;
    address entrypoint;
    SmartWallet smartWallet;
    HelperConfig helperConfig;
    ERC20Mock usdc;
    SendPackedUserOps sendPackedUserOps;

    function setUp() external {
        (smartWallet, helperConfig) = new DeploySmartWallet().run();
        (account, entrypoint,) = helperConfig.activeNetworkConfig();
        usdc = new ERC20Mock();
        sendPackedUserOps = new SendPackedUserOps();
        sendPackedUserOps.run();
    }

    function testMinimalAccountWithOwner() external {
        assertEq(usdc.balanceOf(address(smartWallet)), 0);
        uint256 amountToTransfer = 1e18;
        vm.prank(account);
        smartWallet.execute(
            address(usdc), 0, abi.encodeWithSelector(ERC20Mock.mint.selector, address(smartWallet), amountToTransfer)
        );
        assertEq(usdc.balanceOf(address(smartWallet)), amountToTransfer);
    }

    function testRecoverSignedUserOp() external {
        vm.prank(account);

        PackedUserOperation memory userOp =
            sendPackedUserOps.generateSignedUserOperation(hex"", address(smartWallet), entrypoint);

        bytes32 userOpHash = IEntryPoint(entrypoint).getUserOpHash(userOp);

        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(userOpHash);

        address signer = ECDSA.recover(digest, userOp.signature);
        assertEq(signer, smartWallet.owner());
    }

    // function testValidateUserOps() external {
    //     vm.startPrank(entrypoint);
    //     // smartWallet.validateUserOp();
    // }
}
