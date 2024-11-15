import { ethers } from "hardhat"

const main = async () => {
    const FundMe = await ethers.getContractFactory("FundMe")
    const fundme = await FundMe.deploy()
    fundme.waitForDeployment()

    // const reqEthInUSD = await fundme.getEthAmountInUsd(10)
    // console.log(reqEthInUSD)
    console.log(await fundme.getAddress())
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        console.warn(" Failed to deploy the contract")
    })
