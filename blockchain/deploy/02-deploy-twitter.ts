import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { ethers, network } from "hardhat"
import { networkConfig } from "../helper-hardhat.config.ts"
import { verify } from "../scripts/reusable.ts"

const deployTwitter: DeployFunction = async ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) => {
    console.log(" ------------- 02-deploy-twitter ------------- ")
    const { deploy, log, get } = deployments
    const { lucky, kiran } = await getNamedAccounts()
    const [deployer] = await ethers.getSigners()
    const chainId = network.config.chainId
    let ethPriceFeedAddress
    console.log(" chainId : " + chainId)

    if (chainId === 31337) {
        const MockV3AggregatorContract = await get("MockV3Aggregator")
        ethPriceFeedAddress = MockV3AggregatorContract.address
        // console.log("mockEthUsdpriceFeed : " + ethPriceFeedAddress)
    } else {
        ethPriceFeedAddress = networkConfig[chainId]?.ethUsdPriceFeed
    }
    console.log("ethPriceFeed : " + ethPriceFeedAddress)

    let deployedTwitterContract = await deploy("Twitter", {
        from: lucky,
        args: [ethPriceFeedAddress, "TwitterNfts", "TNFT"],
        log: true,
        gasLimit: 5000000,
        waitConfirmations: networkConfig[chainId].blockConfirmations,
        value: ethers.parseEther("0.01"),
    })

    const twitterAddress = deployedTwitterContract.address
    const twitterContract = await ethers.getContractAt(
        "Twitter",
        twitterAddress,
    )
    console.log(" Nft Symbol :  ", await twitterContract.getNftSymbol())
    // FUND ME
    // let amount = "0.03"

    // console.log(
    //     " Fund me  ",
    //     await twitterContract.fund({ value: ethers.parseEther(amount) }),
    // )
    // console.log(" amount : " + Number(amount) * 34000)
    // console.log(
    //     " Contract Balance " +
    //         ethers.formatEther(
    //             (await ethers.provider.getBalance(twitterAddress)).toString(),
    //         ),
    // )
    if (chainId !== 31337 && process.env.ETHER_SCAN_API) {
        await verify(twitterAddress, [
            ethPriceFeedAddress,
            "TwitterNfts",
            "TNFT",
        ])
    }
}

export default deployTwitter
deployTwitter.tags = ["all", "deployTwitter"]
