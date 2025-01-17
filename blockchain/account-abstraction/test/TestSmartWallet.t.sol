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
import {SIG_VALIDATION_FAILED, SIG_VALIDATION_SUCCESS} from "lib/account-abstraction/contracts/core/Helpers.sol";
import {console} from "forge-std/console.sol";

contract TestSmartWallet is Test {
    address account;
    address entrypoint;
    SmartWallet smartWallet;
    HelperConfig helperConfig;
    ERC20Mock usdc;
    SendPackedUserOps sendPackedUserOps;
    address randomUser;
    uint256 randomUserPrivateKey;
    uint256 constant smartWalletInitialDeposit = 2 ether;
    uint256 anvilPrivateKey = vm.envUint("ANVIL_PRIVATE_KEY");

    function setUp() external {
        (smartWallet, helperConfig) = new DeploySmartWallet().run();
        (account, entrypoint,) = helperConfig.activeNetworkConfig();
        usdc = new ERC20Mock();
        sendPackedUserOps = new SendPackedUserOps();
        sendPackedUserOps.run();
        vm.deal(address(smartWallet), smartWalletInitialDeposit);
        (randomUser, randomUserPrivateKey) = makeAddrAndKey("RandomUser");
    }

    function testExecuteFunWithOwner() external {
        assertEq(usdc.balanceOf(address(smartWallet)), 0);
        uint256 amountToTransfer = 1e18;
        vm.prank(account);
        // TODO : need to test by transfering 2 ether to it
        // the mint function we are calling was not a payable function so cant send ether to a payable funtion
        smartWallet.execute(
            address(usdc), 0, abi.encodeWithSelector(ERC20Mock.mint.selector, address(smartWallet), amountToTransfer)
        );
        assertEq(usdc.balanceOf(address(smartWallet)), amountToTransfer);
    }

    function testRecoverSignedUserOp() external {
        vm.prank(account);

        PackedUserOperation memory userOp =
            sendPackedUserOps.generateSignedUserOperation(hex"", address(smartWallet), entrypoint, anvilPrivateKey);

        bytes32 userOpHash = IEntryPoint(entrypoint).getUserOpHash(userOp);

        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(userOpHash);

        address signer = ECDSA.recover(digest, userOp.signature);
        assertEq(signer, smartWallet.owner());
    }

    function testValidateUserOpsAndDoExecution() external {
        // Arrange
        uint256 amountTransferedToSomeErc20Token = 2 ether; // this was MockWErc20 number , not real ether
        uint256 usdcBalance = usdc.balanceOf(address(smartWallet));
        bytes memory functionDataToExecute =
            abi.encodeWithSelector(ERC20Mock.mint.selector, address(smartWallet), amountTransferedToSomeErc20Token);
        bytes memory callData =
            abi.encodeWithSelector(SmartWallet.execute.selector, address(usdc), 0, functionDataToExecute);
        PackedUserOperation memory userOp =
            sendPackedUserOps.generateSignedUserOperation(callData, address(smartWallet), entrypoint, anvilPrivateKey);
        bytes32 userOpHash = IEntryPoint(entrypoint).getUserOpHash(userOp);
        uint256 missingAccountFunds = 0;
        uint256 missingFundsTrue = 1 ether;
        PackedUserOperation[] memory ops = new PackedUserOperation[](1);
        ops[0] = userOp;

        // Act
        vm.startPrank(entrypoint);
        uint256 validationData = smartWallet.validateUserOp(userOp, userOpHash, missingAccountFunds);
        IEntryPoint(entrypoint).handleOps(ops, payable(randomUser));
        // with missigng funds
        uint256 entryPointBalance = address(entrypoint).balance;
        uint256 validationDataWithMissingFunds = smartWallet.validateUserOp(userOp, userOpHash, missingFundsTrue);

        // Assert
        assertEq(validationData, SIG_VALIDATION_SUCCESS);
        assertEq(validationDataWithMissingFunds, 0);
        assertEq(address(entrypoint).balance, entryPointBalance + missingFundsTrue);
        assertEq(usdc.balanceOf(address(smartWallet)), usdcBalance + amountTransferedToSomeErc20Token);
        assert(randomUser.balance > 0);
        // UserDeposit = OurSmartContractDepositedToEntryPoint -  benificieryUserPayment
        // missingFundsTrue = 1 ether will also be transfered to deposits of our account in entrypoint
        assertEq(
            IEntryPoint(entrypoint).balanceOf(address(smartWallet)),
            smartWalletInitialDeposit - address(smartWallet).balance - address(randomUser).balance
        );
    }

    function testAnotherAccountSigningTransaction() external {
        vm.startPrank(account);
        smartWallet.addAuthorizedSender(randomUser);
        vm.stopPrank();
        PackedUserOperation memory userOp =
            sendPackedUserOps.generateSignedUserOperation(hex"", address(smartWallet), entrypoint, randomUserPrivateKey);
        vm.startPrank(entrypoint);
        uint256 validationData = smartWallet.validateUserOp(userOp, IEntryPoint(entrypoint).getUserOpHash(userOp), 0);
        assertEq(validationData, SIG_VALIDATION_SUCCESS);
    }
}
