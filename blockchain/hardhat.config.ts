import { HardhatUserConfig, task } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "dotenv/config"
import "@nomicfoundation/hardhat-verify"
import "./tasks/show-balance"
import "./tasks/block-number"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "hardhat-deploy"
import "hardhat-ethernal"
import "hardhat-contract-sizer"

task("accounts", "prints the list of the accounts ", async (taskargs, hre) => {
    const accounts = await hre.ethers.getSigners()
    accounts.forEach((account) => console.log(account.address))
})

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2 || "0xkey"
const SEPOLIA_URL = process.env.SEPOLIA_URL
const MAINNET_URL = process.env.MAINNET_URL
const ETHER_SCAN_API = process.env.ETHER_SCAN_API
const COINMARKET_CAP_API = process.env.COINMARKET_CAP_API
const FORKED_MAINNET_URL = process.env.FORKED_MAINNET_URL || ""

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_URL,
            accounts:
                PRIVATE_KEY != undefined ? [PRIVATE_KEY, PRIVATE_KEY_2] : [],
            chainId: 11155111,
        },
        mainnet: {
            chainId: 1,
            url: MAINNET_URL,
            accounts:
                PRIVATE_KEY != undefined ? [PRIVATE_KEY, PRIVATE_KEY_2] : [],
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            loggingEnabled: true,
            gas: 6000000, // Adjust the gas limit here
            blockGasLimit: 12000000, // Adjust the block gas limit if needed
            chainId: 31337, // same as hardhat node
            // accounts will be provided by harhat
        },
        hardhat: {
            // forking: {
            //     url: FORKED_MAINNET_URL,
            // },
            gas: 6000000, // Adjust the gas limit here
            blockGasLimit: 12000000, // Adjust the block gas limit if needed
            chainId: 31337,
            loggingEnabled: true,
        },
    },
    solidity: {
        compilers: [
            { version: "0.8.8" },
            {
                version: "0.8.23",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200, // reduces deployment cost and run time cost
                    },
                },
            },
            { version: "0.8.2" },
            { version: "0.8.20" },
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200, // reduces deployment cost and run time cost
                    },
                },
            },
            { version: "0.6.12" },
            { version: "0.6.6" },
            { version: "0.4.19" },
        ],
    },
    etherscan: {
        apiKey: ETHER_SCAN_API,
    },
    sourcify: {
        enabled: false,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gasReport.txt",
        currency: "USD",
        noColors: true,
        coinmarketcap: COINMARKET_CAP_API,
        token: "ETH",
    },
    namedAccounts: {
        lucky: {
            default: 0, // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        },
        kiran: {
            default: 1, // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
        },
    },
    ethernal: {
        disableSync: true, // If set to true, plugin will not sync blocks & txs
        disableTrace: true, // If set to true, plugin won't trace transaction
        workspace: "Twitter-clone", // Set the workspace to use, will default to the default workspace (latest one used in the dashboard). It is also possible to set it through the ETHERNAL_WORKSPACE env variable
        uploadAst: false, // If set to true, plugin will upload AST, and you'll be able to use the storage feature (longer sync time though)
        disabled: false, // If set to true, the plugin will be disabled, nohting will be synced, ethernal.push won't do anything either
        resetOnStart: undefined, // Pass a workspace name to reset it automatically when restarting the node, note that if the workspace doesn't exist it won't error
        serverSync: false, // Only available on public explorer plans - If set to true, blocks & txs will be synced by the server. For this to work, your chain needs to be accessible from the internet. Also, trace won't be synced for now when this is enabled.
        skipFirstBlock: false, // If set to true, the first block will be skipped. This is mostly useful to avoid having the first block synced with its tx when starting a mainnet fork
        verbose: false, // If set to true, will display this config object on start and the full error object
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
}

export default config
