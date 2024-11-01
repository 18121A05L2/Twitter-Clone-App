import { ethers, getNamedAccounts } from "hardhat"
import axios from "axios"
// import { TwitterNfts } from "../typechain-types/contracts/TwitterNfts"
import { Twitter, TwitterNfts__factory, TwitterNfts } from "../typechain-types"
import { localBackend, tokenDecimals } from "../utils/constants"
import { deployments } from "hardhat"
import { assert, expect } from "chai"
import { ZeroAddress } from "ethers"

describe("Running NFT test cases", () => {
    let nftContractFactory: TwitterNfts__factory,
        nftContract: TwitterNfts,
        twitterContract: Twitter
    let lucky: string
    let kiran: string
    let nftContractAddress: string

    before("Setting up Main contracts", async function () {
        // console.log("Running before all tests")
        const namedAccounts = await getNamedAccounts()
        lucky = namedAccounts.lucky
        kiran = namedAccounts.kiran
        nftContractFactory = await ethers.getContractFactory("TwitterNfts")
        await deployments.fixture(["all"])
        const nftDployment = await deployments.get("TwitterNfts")
        nftContract = await ethers.getContractAt(
            "TwitterNfts",
            nftDployment.address,
        )
        nftContractAddress = nftDployment.address
        const twitterDeployment = await deployments.get("Twitter")
        twitterContract = await ethers.getContractAt(
            "Twitter",
            twitterDeployment.address,
        )
        expect(twitterDeployment.address).to.equal(
            await nftContract.twitterContract(),
        )
    })

    it(" Initial NFT contract checks", async () => {
        const nextTokenIdToMint = Number(await nftContract.nextTokenIdToMint())
        expect(nextTokenIdToMint).to.equal(1)
        const owner = await nftContract.getOwner()
        expect(owner).to.equal(lucky)
    })

    it("Mint First NFT", async () => {
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
        const profile = await twitterContract.getProfile(lucky)
        const profileRes = await fetch(profile).then((res) => res.json())
        const nft = await nftContract.tokenURI(profileRes.nftId)
        const nftRes = await fetch(nft).then((res) => res.json())
        expect(nftRes.nftName).to.equal(profileUriData.nftName)
    })

    describe("List an NFt , buy and cancel", () => {
        const tokenId = 1
        const price = 5
        const listingPrice = ethers.parseUnits(price.toString(), tokenDecimals)

        // Lising an NFT
        before(async () => {
            const res = (
                await nftContract.listNFT(tokenId, listingPrice)
            ).wait()
            const listedNft = await nftContract.getListedNFT(tokenId)
            console.log({ listedNft, lucky }) // listedNft: Result(3) ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 500000000n, false]
            const response = await nftContract.getApproved(tokenId)
            expect(response).to.equal(nftContractAddress)
            expect(listedNft.price).to.equal(listingPrice)
            expect(listedNft.owner).to.equal(lucky)
            const nonListedNft = await nftContract.getListedNFT(3)
            expect(nonListedNft.owner).to.equal(ZeroAddress)
        })

        it("Buying an Nft", async () => {
            const tokensInSellerAccount = await twitterContract.balanceOf()
            const kiranSigner = await ethers.getSigner(kiran)
            const initialBuyerTokens = await twitterContract
                .connect(kiranSigner)
                .balanceOf()
            expect(
                Number(ethers.formatUnits(initialBuyerTokens, tokenDecimals)),
            ).to.equal(0)

            const result = (
                await twitterContract.connect(kiranSigner).faucet()
            ).wait()
            const buyerTwtAfterFaucet = await twitterContract
                .connect(kiranSigner)
                .balanceOf()
            expect(
                Number(ethers.formatUnits(buyerTwtAfterFaucet, tokenDecimals)),
            ).greaterThan(5)

            const buyRes = (
                await nftContract
                    .connect(kiranSigner)
                    .buyNFT(tokenId, listingPrice)
            ).wait()

            const ownerOfNft = await nftContract.ownerOf(tokenId)
            expect(ownerOfNft).to.equal(kiran)
            const currentSellerTokens = await twitterContract.balanceOf()
            expect(
                Number(ethers.formatUnits(currentSellerTokens, tokenDecimals)),
            ).to.equal(
                Number(
                    ethers.formatUnits(tokensInSellerAccount, tokenDecimals),
                ) + price,
            )

            const currentBuyerTokens = await twitterContract
                .connect(kiranSigner)
                .balanceOf()
            expect(
                Number(ethers.formatUnits(currentBuyerTokens, tokenDecimals)),
            ).to.equal(
                Number(ethers.formatUnits(buyerTwtAfterFaucet, tokenDecimals)) -
                    price,
            )
        })
        // this can only able to check when we comment the above Buy an NFT test
        // it.only("Canceling an Nft", async () => {
        //     const res = (await nftContract.cancelNFT(tokenId)).wait()
        //     const listedNft = await nftContract.getListedNFT(tokenId)
        //     expect(listedNft.price).to.equal(0)
        //     expect(listedNft.owner).to.equal(ZeroAddress)
        // })
    })

//     it("Should support IERC721 interface", async function () {
//   expect(await nft.supportsInterface("0x80ac58cd")).to.be.true; // ERC721 interface ID
// });
})
