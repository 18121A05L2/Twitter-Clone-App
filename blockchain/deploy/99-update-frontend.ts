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

    let twitterContactAddress
    let nftContractAddress

    // if (process.env.UPDATE_FRONT_END) {
    console.log(" ---------------- 99-update-frontend --------------")
    // const Twitter = await ethers.getContractFactory("Twitter")
    // fs.writeFileSync(frontEndTwitterAbiFile, Twitter.interface.formatJson())

    const contractAddresses = JSON.parse(
        fs.readFileSync(frontEndContractAddresses, "utf8"),
    )

    // updating twitter contract
    const twitterContract = await deployments.get("Twitter")
    twitterContactAddress = twitterContract.address
    contractAddresses[chainId] = {}
    contractAddresses[chainId]["Twitter"] = twitterContract.address

    // updating NFT contract
    const nftContract = await deployments.get("TwitterNfts")
    contractAddresses[chainId]["TwitterNfts"] = nftContract.address
    nftContractAddress = nftContract.address
    // updating Deployed contract addresses
    fs.writeFileSync(
        frontEndContractAddresses,
        JSON.stringify(contractAddresses),
    )
    // updating ABI files
    fs.writeFileSync(
        frontEndTwitterAbiFile,
        JSON.stringify(twitterContract.abi),
    )
    fs.writeFileSync(
        forntEndTwitterNftsAbiFile,
        JSON.stringify(nftContract.abi),
    )
    console.log(contractAddresses)
    // }

    // updating contract Addresses in the contracts
    const deployedTwitterContract = await ethers.getContractAt(
        "Twitter",
        twitterContactAddress,
    )
    const nftContractTxResponse =
        await deployedTwitterContract.setNftContractAddress(nftContractAddress)
    nftContractTxResponse.wait()
    const deployedNftContract = await ethers.getContractAt(
        "TwitterNfts",
        nftContractAddress,
    )
    const twitterContractTxResponse =
        await deployedNftContract.setTwitterContractAddress(
            twitterContactAddress,
        )
    twitterContractTxResponse.wait()
    console.log(
        " nftContract address: ",
        await deployedTwitterContract.nftContract(),
    )
    console.log(
        " twitterContract address: ",
        await deployedNftContract.twitterContract(),
    )
}

export default updateFrontEnd
updateFrontEnd.tags = ["all", "updateFE"]
