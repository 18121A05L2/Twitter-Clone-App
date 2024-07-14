import { ethers } from "hardhat"
import { assert, expect } from "chai"
import { Twitter, Twitter__factory } from "../typechain-types"

describe("running Twitter tests ", async () => {
    let Twitter: Twitter__factory
    let twitter: Twitter

    beforeEach(async () => {
        Twitter = await ethers.getContractFactory("Twitter")
        // twitter = await Twitter.deploy()
    })

    // it(" checks the perTweet cost", async () => {
    //     const totalSupply = await twitter.getTotalSupply()
    //     console.log(totalSupply)
    //     const expectedCost = 1000
    //     // assert.equal(Number(totalSupply), expectedCost)
    //     // expect(Number(totalSupply)).to.equal(expectedCost)
    // })
})
