// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {DecentralizedStableCoin} from "./DecentralizedStableCoin.sol";
import {DSCEngineInterface} from "./DSCEngineInterface.i.sol";
import {DecentralizedStableCoin} from "./DecentralizedStableCoin.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract DSCEngine is  ReentrancyGuard {
    error DSCEngine_mustBeMoreThanZero();
    error DSCEngine_tokenNotAllowed();
    error DSCEngine_tokenAddressMismatchToPriceFeed();
    error DSCEngine_tokenTransferFailed();
    error DSCEngine_HealthFactorIsBroken(uint256 userHealthFactor);
    error DSCEngine_mintFailed();

    mapping(address token => address priceFeed) private s_tokenAddToPriceFeed;
    mapping(address user => mapping(address token => uint256 amount)) public s_collateralDeposited;
    mapping(address user => uint256 amountOfDsc) public s_amountOfDscMinted;
    address[] s_collateralTokens;

    DecentralizedStableCoin private immutable i_dscContractAddress;
    uint256 public constant LIQUIDATION_THRESHOLD = 75;
    uint256 public constant LIQUIDATION_PRECISION = 100;
    uint256 private constant ADDITIONAL_FEED_PRECISION = 1e10;
    uint256 private constant PRECISION = 1e18;
    uint256 private constant MIN_HEALTH_FACTOR = 1;

    // Events
    event CollateralDeposited(address indexed user, address indexed token, uint256 indexed amount);
    event CollateralRedeemed(address indexed redeemFrom, address indexed redeemTo, address token, uint256 amount);

    modifier moreThanZero(uint256 amount) {
        if (amount == 0) {
            revert DSCEngine_mustBeMoreThanZero();
        }
        _;
    }

    modifier isTokenAllowed(address tokenAddress) {
        if (s_tokenAddToPriceFeed[tokenAddress] == address(0)) {
            revert DSCEngine_tokenNotAllowed();
        }
        _;
    }

    constructor(address[] memory tokenAddresses, address[] memory priceFeedAddresses, address dscContractAddress) {
        if (tokenAddresses.length != priceFeedAddresses.length) {
            revert DSCEngine_tokenAddressMismatchToPriceFeed();
        }
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            s_tokenAddToPriceFeed[tokenAddresses[i]] = priceFeedAddresses[i];
            s_collateralTokens.push(tokenAddresses[i]);
        }
        // typecasting dscContractAddress with DecentralizedStableCoin contract
        i_dscContractAddress = DecentralizedStableCoin(dscContractAddress);
    }

    function DepositCollateralAndMintDsc() external {}

    function DepositCollateral(address tokenAddress, uint256 amount)
        external
        moreThanZero(amount)
        isTokenAllowed(tokenAddress)
        nonReentrant
    {
        // how are we sure that user has been paying to us the amount he has been inputing
        s_collateralDeposited[msg.sender][tokenAddress] += amount;
        emit CollateralDeposited(msg.sender, tokenAddress, amount);
        bool success = IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        if (!success) revert DSCEngine_tokenTransferFailed();
    }

    function mintDsc(uint256 dscAmountToMint) external moreThanZero(dscAmountToMint) nonReentrant {
        s_amountOfDscMinted[msg.sender] += dscAmountToMint;
        revertIfHealtFactorIsBroken(dscAmountToMint);
        (bool minted) = i_dscContractAddress.mint(msg.sender, dscAmountToMint);
        if (!minted) {
            revert DSCEngine_mintFailed();
        }
    }

    function _healthFactor(address user) internal view returns (uint256) {
        // Health Factor = (Total Collateral Value * Weighted Average Liquidation Threshold) / Total Borrow Value
        uint256 totalCollateralValueInUsd = getAccountCollateralValue(user);
        uint256 totalDscMinted = s_amountOfDscMinted[user];
        uint256 collaternalAdjustedForThreshold =
            totalCollateralValueInUsd * LIQUIDATION_THRESHOLD / LIQUIDATION_PRECISION;
        return (collaternalAdjustedForThreshold * PRECISION) / totalDscMinted;
    }

    function revertIfHealtFactorIsBroken(uint256 dscAmountToMint) internal view {
        s_amountOfDscMinted[msg.sender] += dscAmountToMint;
        uint256 userHealthFactor = _healthFactor(msg.sender);
        if (userHealthFactor < MIN_HEALTH_FACTOR) {
            revert DSCEngine_HealthFactorIsBroken(userHealthFactor);
        }
    }

    /**
     * @notice This function will loop through the each collateral token and calculate the total collateral value
     *
     */
    function getAccountCollateralValue(address user) public view returns (uint256 totalCollateralValue) {
        for (uint256 i = 0; i < s_collateralTokens.length; i++) {
            uint256 amount = s_collateralDeposited[user][s_collateralTokens[i]];
            uint256 amountInUsd = getUsdValue(s_collateralTokens[i], amount);
            totalCollateralValue = totalCollateralValue + amountInUsd;
        }
    }

    function getUsdValue(address token, uint256 amount) public view returns (uint256) {
        // uint256 tokenDecimals = uint256(IERC20(token).decimals());
        AggregatorV3Interface priceFeed = AggregatorV3Interface(s_tokenAddToPriceFeed[token]);
        (uint80 roundId, int256 price, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound) =
            priceFeed.latestRoundData();
        uint256 tokenDecimals = uint256(priceFeed.decimals());
        return ((uint256(price) * (PRECISION - 10 ** tokenDecimals)) * amount) / PRECISION;
    }
}
