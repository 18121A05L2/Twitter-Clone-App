import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const accountAbstraction: DeployFunction = async ({
    deployments,
    getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
    console.log("--------------- 04-entrypoint-accountabstraction ----------")
    const { deploy, log } = deployments
    const { lucky } = await getNamedAccounts()
    const deploymentResult = await deploy("EntryPoint", {
        from: lucky,
        args: [],
        log: true,
        waitConfirmations: 1,
    })
}

export default accountAbstraction
accountAbstraction.tags = [ "entryPoint"]
