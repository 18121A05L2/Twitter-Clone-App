import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { verify } from "../scripts/reusable"
import { ethers } from "hardhat"

const twitterProxy: DeployFunction = async ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) => {
    console.log(" ------------- 01-twitter-proxy ------------- ")
    const { deploy } = deployments
    const { lucky } = await getNamedAccounts()

    const twitter = await deployments.get("Twitter")
    const twitterAddress = twitter.address
    console.log("twitter address : " + twitterAddress)

    const TwitterProxyContractDeployment = await deploy("TwitterProxy", {
        from: lucky,
        args: [twitterAddress],
        log: true,
        waitConfirmations: 1,
    })

    if (process.env.ETHER_SCAN_API) {
        await verify(TwitterProxyContractDeployment.address, [twitterAddress])
    }

    // Interact with the deployed contract using ethers
    const TwitterProxyContract = await ethers.getContractAt(
        "TwitterProxy",
        TwitterProxyContractDeployment.address,
    )

    // TODO: this is for temporarily
    // const txtResponse = await TwitterProxyContract.updateImplementation(
    //     "0x3A236fd775A88aDf978d5b9Ad439dBaf9008Bba2",
    // )
    // console.log(txtResponse)
}

export default twitterProxy
twitterProxy.dependencies = ["Twitter"]
twitterProxy.tags = ["all", "twitterProxy"]
