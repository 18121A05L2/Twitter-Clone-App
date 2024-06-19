import { ethers, network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { verify } from "../scripts/reusable"

const deployTwitterNfts: DeployFunction = async ({
    deployments,
    getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
    console.log("--------------------- 03-deploy-twitter-nfts ----------")
    const { log, deploy } = deployments
    const { lucky } = await getNamedAccounts()
    const chainId = network.config.chainId
    const deployedContract = await deploy("TwitterNfts", {
        from: lucky,
        args: ["TwitterNfts", "TNFT"],
        log: true,
        waitConfirmations: 1,
    })

    const nftContract = await ethers.getContractAt(
        "TwitterNfts",
        deployedContract.address,
    )
    console.log(await nftContract.nftSymbol())
    const nftContractAddress = deployedContract.address
    if (chainId !== 31337 && process.env.ETHER_SCAN_API) {
        await verify(nftContractAddress, ["TwitterNfts", "TNFT"])
    }
}

export default deployTwitterNfts
// deployTwitterNfts.tags = ["all", "deployTwitterNfts"]
