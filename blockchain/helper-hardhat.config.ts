const developmentChains = ["hardhat", "localhost"]
const blockConfirmations = 6
const networkConfig = {
    1: {
        name: "mainnet",
        ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        blockConfirmations,
        wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        blockConfirmations,
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        blockConfirmations,
    },
    80001: {
        name: "mumbai",
        ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
        blockConfirmations,
    },
    31337: {
        name: "hardhat",
        blockConfirmations: 0,
        wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // mainnet weth address , using it here with the help of forked mainnet
    },
}

const DECIMALS = 8
const INITIAL_ANSWER = 340000000000

const frontEndTwitterAbiFile = "../frontend/utils/Blockchain/TwitterAbi.json"
const forntEndTwitterNftsAbiFile =
    "../frontend/utils/Blockchain/TwitterNftsAbi.json"
const frontEndContractAddresses =
    "../frontend/utils/Blockchain/contractAddresses.json"

export {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
    frontEndTwitterAbiFile,
    forntEndTwitterNftsAbiFile,
    frontEndContractAddresses,
}
