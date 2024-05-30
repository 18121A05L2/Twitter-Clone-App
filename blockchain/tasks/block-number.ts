import { task } from "hardhat/config"

task(
    "block-number",
    "current block nummber in this chain",
    async (_, { ethers }) => {
        const blockNumber = await ethers.provider.getBlockNumber()
        console.log(blockNumber)
    },
)

module.exports = {}
