import { ethers, getNamedAccounts } from "hardhat"
import axios from "axios"
// import { TwitterNfts } from "../typechain-types/contracts/TwitterNfts"
import { Twitter, TwitterNfts__factory, TwitterNfts } from "../typechain-types"
import { localBackend } from "../utils/constants"
import { deployments } from "hardhat"
import { assert, expect } from "chai"

describe("Running NFT test cases", () => {
    let nftContractFactory: TwitterNfts__factory,
        nftContract: TwitterNfts,
        twitterContract: Twitter
    let lucky: string

    before("Setting up Main contracts", async function () {
        // console.log("Running before all tests")
        const namedAccounts = await getNamedAccounts()
        lucky = namedAccounts.lucky
        nftContractFactory = await ethers.getContractFactory("TwitterNfts")
        await deployments.fixture(["all"])
        const nftDployment = await deployments.get("TwitterNfts")
        nftContract = await ethers.getContractAt(
            "TwitterNfts",
            nftDployment.address,
        )
        const twitterDeployment = await deployments.get("Twitter")
        twitterContract = await ethers.getContractAt(
            "Twitter",
            twitterDeployment.address,
        )
        expect(twitterDeployment.address).to.equal(
            await nftContract.twitterContract(),
        )
    })

    // beforeEach(async () => {
    //     console.log("Running before each test")
    // })

    it(" Initial NFT contract checks", async () => {
        const nextTokenIdToMint = Number(await nftContract.nextTokenIdToMint())
        expect(nextTokenIdToMint).to.equal(1)
    })

    it("Mint an NFT", async () => {
        // storing data in IPFS ( here local database )
        const nftUriData = {
            avatar: "imageUrl",
            nftName: "firstNft",
            userId: "firstUser",
            nftId: 1,
            address: lucky,
        }
        const profileUriData = {
            ...nftUriData,
        }
        const nftHash = await axios
            .post(`${localBackend}/mock/uploadJsonToIpfs`, profileUriData)
            .then((res) => res.data)

        const profileHash = await axios
            .post(`${localBackend}/mock/uploadJsonToIpfs`, nftUriData)
            .then((res) => res.data)

        const nftUri = `${localBackend}/data/${nftHash}`
        const profileUri = `${localBackend}/data/${profileHash}`
        const res = (await nftContract.mintTo(nftUri, profileUri)).wait()
        const firstNft = await nftContract.tokenURI(1)
        const profile = await twitterContract.getProfile(lucky)
        console.log(" ------------ -----------------------------------------")
        console.log({ profile, firstNft })
        const profileRes = await fetch(profile).then((res) => res.json())
        const nft = await nftContract.tokenURI(profileRes.nftId)
        const nftRes = await fetch(nft).then((res) => res.json())
        expect(nftRes.nftName).to.equal(profileUriData.nftName)
    })
})
