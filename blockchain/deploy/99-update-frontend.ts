import fs from "fs"
import {
    frontEndTwitterAbiFile,
    frontEndContractAddresses,
    forntEndTwitterNftsAbiFile,
} from "../helper-hardhat.config"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const updateFrontEnd: DeployFunction = async (
    hre: HardhatRuntimeEnvironment,
) => {
    const { ethers, network, deployments } = hre
    const chainId = network.config.chainId || 31337

    if (process.env.UPDATE_FRONT_END) {
        console.log(" ---------------- 99-update-frontend --------------")
        // const Twitter = await ethers.getContractFactory("Twitter")
        // fs.writeFileSync(frontEndTwitterAbiFile, Twitter.interface.formatJson())

        const contractAddresses = JSON.parse(
            fs.readFileSync(frontEndContractAddresses, "utf8"),
        )

        // updating twitter contract
        const twitter = await deployments.get("Twitter")
        contractAddresses[chainId] = {}
        contractAddresses[chainId]["Twitter"] = twitter.address

        // updating NFT contract
        const temp = await deployments.get("TwitterNfts")
        contractAddresses[chainId]["TwitterNfts"] = temp.address
        // updating Deployed contract addresses
        fs.writeFileSync(
            frontEndContractAddresses,
            JSON.stringify(contractAddresses),
        )
        // updating ABI files
        fs.writeFileSync(frontEndTwitterAbiFile, JSON.stringify(twitter.abi))
        fs.writeFileSync(forntEndTwitterNftsAbiFile, JSON.stringify(temp.abi))
        console.log(contractAddresses)
    }
}

export default updateFrontEnd
updateFrontEnd.tags = ["all", "updateFE"]
