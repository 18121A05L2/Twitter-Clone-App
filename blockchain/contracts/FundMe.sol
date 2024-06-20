// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;
import "hardhat/console.sol";

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library FundMe {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (int256) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int256 answer,  /* 319077267081 */
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return answer;
    }

    function getEthAmountInUsd(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = uint256(getPrice(priceFeed)) * 10e10;
        uint256 ethAmountInUSD = (ethAmount * ethPrice) / 10e18;
        return ethAmountInUSD;
    }

    // function getUsdInEth(
    //     uint256 dollars,
    //     AggregatorV3Interface priceFeed
    // ) internal view returns (uint256) {
    //     uint256 ethPrice = uint256(getPrice(priceFeed));
    //     console.log("eth price : ", ethPrice);
    //     console.log("dollars : ", dollars);
    //     uint256 usdInEth = (dollars / (ethPrice / 10e18)) * 10e18;
    //     return usdInEth;
    // }
}
