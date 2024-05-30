import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DECIMALS, INITIAL_ANSWER } from "../helper-hardhat.config"

const deployMocks: DeployFunction = async ({
    getNamedAccounts,
    deployments,
}: HardhatRuntimeEnvironment) => {
    console.log(" ------------- 00-deploy-mocks ------------- ")
    const { deploy, log } = deployments
    const { lucky } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (chainId == 31337) {
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: lucky,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })

        log("Mocks Deployed!")
        log(
            "You are deploying to a local network, you'll need a local network running to interact",
        )
        log(
            "Please run `yarn hardhat console` to interact with the deployed smart contracts!",
        )
    }
}

export default deployMocks
deployMocks.tags = ["all", "mocks"]
