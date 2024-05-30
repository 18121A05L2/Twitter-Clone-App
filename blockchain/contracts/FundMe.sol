// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library FundMe {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,  /* 319077267081 */
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        // return price in 18 decimals
        return uint256(answer * 10 ** 10);
    }

    function getEthAmountInUsd(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUSD = (ethAmount * ethPrice) / 10e18;
        return ethAmountInUSD;
    }

    function getUsdInEth(
        uint256 dollars,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 usdInEth = (dollars / (ethPrice / 10e18)) * 10e18;
        return usdInEth;
    }
}
