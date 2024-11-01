import { ethers  , deployments} from "hardhat"
import { assert, expect } from "chai"
import { Twitter } from "../typechain-types"
import { perTweetConst} from "../test/constants.ts"

describe("running Twitter tests ", async () => {
    let twitterContract: Twitter

    beforeEach(async () => {
        await deployments.fixture(["all"])
        const twitterDeployment = await deployments.get("Twitter")
        twitterContract = await ethers.getContractAt(
            "Twitter",
            twitterDeployment.address,
        )
        console.log(twitterContract)
 
    })

    it(" checks the perTweet cost", async () => {
        console.log({twitterContract})
        const totalSupply = await twitterContract.totalSupply()
        const decimals = await twitterContract.decimals()
        console.log(totalSupply)
        const expectedCost = perTweetConst*10**decimals
        assert.equal(Number(totalSupply), expectedCost)
        expect(Number(totalSupply)).to.equal(expectedCost)
    })

//     it("Should support IERC20 interface", async function () {
//   expect(await token.supportsInterface("0x36372b07")).to.be.true; // ERC20 interface ID
// });
})
