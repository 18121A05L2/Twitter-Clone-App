import { run } from "hardhat"

export const verify = async (contractAddress: string, args: any[]) => {
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (err: any) {
        console.log("Error ")
        if (err.message.toLowerCase().includes("already been verified")) {
            console.log(" Already Verified smart contract " + contractAddress)
        } else {
            console.log(" Error : " + err)
        }
    }
}
