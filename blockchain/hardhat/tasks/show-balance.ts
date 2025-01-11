import { task } from "hardhat/config"

task("show-balance", "show current user balance")
    .addOptionalParam("address", "ether address to check balance")
    .setAction(async (args, { ethers }) => {
        console.log(args)
        if (!args.address) {
            throw new Error("Address is required as an argument.")
        }
        const balance = await ethers.provider.getBalance(args?.address)
        console.log(balance)
    })

module.exports = {}
