// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {PackedUserOperation} from "lib/account-abstraction/contracts/interfaces/PackedUserOperation.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {HelperConfig} from "./HelperConfig.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {IEntryPoint} from "lib/account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {console} from "forge-std/console.sol";
import {DeploySmartWallet} from "./DeploySmartWallet.sol";

contract SendPackedUserOps is Script {
    address account;

    address smartWallet;

    function run() public returns (HelperConfig helperConfig) {
        (, helperConfig) = new DeploySmartWallet().run();
        smartWallet = DevOpsTools.get_most_recent_deployment("SmartWallet", block.chainid);

        (account,,) = helperConfig.activeNetworkConfig();
    }

    function generateSignedUserOperation(bytes memory callData, address sender , address entryPoint)
        external
        view
        returns (PackedUserOperation memory)
    {
        uint256 nonce = vm.getNonce(smartWallet);
        PackedUserOperation memory userOp = _generateUnsignedUserOperation(callData, sender, nonce);
        bytes32 userOpHash = IEntryPoint(entryPoint).getUserOpHash(userOp);

        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(userOpHash);

        uint8 v;
        bytes32 r;
        bytes32 s;
        //TODO : need to add this as dynamic
        uint256 ANVIL_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        (v, r, s) = vm.sign(ANVIL_PRIVATE_KEY, digest);

        userOp.signature = abi.encodePacked(r, s, v);

        return userOp;
    }

    function _generateUnsignedUserOperation(bytes memory callData, address sender, uint256 nonce)
        internal
        pure
        returns (PackedUserOperation memory)
    {
        uint128 verificationGasLimit = 16777216;
        uint128 callGasLimit = verificationGasLimit;
        uint128 maxPriorityFeePerGas = 256;
        uint128 maxFeePerGas = maxPriorityFeePerGas;
        return PackedUserOperation({
            sender: sender,
            nonce: nonce,
            initCode: hex"",
            callData: callData,
            accountGasLimits: bytes32(uint256(verificationGasLimit) << 128 | callGasLimit),
            preVerificationGas: verificationGasLimit,
            gasFees: bytes32(uint256(maxPriorityFeePerGas) << 128 | maxFeePerGas),
            paymasterAndData: hex"",
            signature: hex""
        });
    }
}
