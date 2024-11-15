import { ethers, network } from "hardhat"
import { verify } from "./reusable"

const main = async () => {
    const Twitter = await ethers.getContractFactory("Twitter")
    console.log(" Deploying Twitter contract ")
    const twitter = await Twitter.deploy()
    await twitter.waitForDeployment()
    const contractAddress = await twitter.getAddress()
    const owner = await twitter.getOwner()
    console.log(" address : " + contractAddress)
    console.log(" owner : " + owner)

    // verifying in sepolia network
    if (network.config.chainId === 11155111) {
        await verify(contractAddress, [])
    }

    const transactionResponse = await twitter.storeMsg("Hello")
    transactionResponse.wait(6)
    await twitter.storeMsg("Hellooooo")
    const allMessages = await twitter.retriveMessages()
    console.log(" all messages : " + allMessages)
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.warn(err)
        console.warn("Failed to deply the contract")
        process.exit(1)
    })

// import { ethers } from "hardhat";

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = ethers.parseEther("0.001");

//   const lock = await ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
