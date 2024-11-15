import { ethers, deployments } from "hardhat"
import { assert, expect } from "chai"
import { Twitter } from "../typechain-types"
import { perTweetCost , TOTAL_SUPPLY } from "../utils/constants"

describe("running Twitter tests ", async () => {
    let twitterContract: Twitter

    beforeEach(async () => {
        await deployments.fixture(["all"])
        const twitterDeployment = await deployments.get("Twitter")
        twitterContract = await ethers.getContractAt(
            "Twitter",
            twitterDeployment.address,
        )
    })

    it(" checks the perTweet cost", async () => {
        const totalSupply = await twitterContract.totalSupply()
        const decimals = Number(await twitterContract.decimals())
        const expectedCost = (perTweetCost * 10 ** decimals)*TOTAL_SUPPLY
        assert.equal(Number(totalSupply), expectedCost)
        expect(Number(totalSupply)).to.equal(expectedCost)
    })

    // we can only check the interface Id only when we xoring all the extra functions that we have been using in the Contracts

    // it("Should support IERC20 interface", async function () {
    //   expect(await twitterContract.supportsInterface("0x36372b07")).to.be.true; // ERC20 interface ID
    // });
})
