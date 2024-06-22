// SPDX-License-Identifier: MIT
// Marketplace
pragma solidity ^0.8.8;
import "./TwitterNfts.sol";
import "./TwitterToken.sol";
import "hardhat/console.sol";

// interface IERC721 {
//     function safeTransferFrom(
//         address _from,
//         address _to,
//         uint256 _tokenId
//     ) external;

//     function transferNftFrom(
//         address _from,
//         address _to,
//         uint256 _tokenId
//     ) external;

//     function ownerOf(uint256 _tokenId) external view returns (address);
// }

contract Marketplace {
    TwitterNfts public nftContract;
    TwitterToken public twitterTokenContract;
    address public admin;

    event NFTListed(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 price
    );
    event NFTSold(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );
    event NFTCanceled(uint256 indexed tokenId, address indexed owner);

    constructor(address _admin) {
        require(_admin != address(0), "Invalid admin address");
        admin = _admin;
    }

    struct NFT {
        address owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => NFT) public listedNfts;
    bool private locked = false;

    modifier ownerOfToken(uint256 _tokenId) {
        require(nftContract.ownerOf(_tokenId) == msg.sender, "Not the owner");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function listNFT(
        uint256 _tokenId,
        uint256 _price
    ) external ownerOfToken(_tokenId) {
        require(_price > 0, "Price must be greater than zero");

        // Transfer the NFT from the owner to the marketplace contract
        nftContract.transferNftFrom(msg.sender, address(this), _tokenId);

        // List the NFT
        listedNfts[_tokenId] = NFT(msg.sender, _price, false);

        emit NFTListed(_tokenId, msg.sender, _price);
    }

    function buyNFT(
        uint256 _tokenId,
        uint256 _price
    ) external payable nonReentrant {
        NFT storage nft = listedNfts[_tokenId];
        require(!nft.sold, "NFT already sold");
        require(nft.price == _price, "Incorrect price");
        require(nft.owner != msg.sender, "Cannot buy your own NFT");
        require(
            twitterTokenContract.balanceOf() >= _price,
            "Insufficient token balance"
        );

        nft.sold = true;
        address seller = nft.owner;

        // Transfer the NFT from the marketplace contract to the buyer
        nftContract.safeTransferFrom(address(this), msg.sender, _tokenId);

        // Transfer the payment to the seller
        // payable(seller).transfer(msg.value);
        twitterTokenContract.transfer(seller, nft.price);

        emit NFTSold(_tokenId, msg.sender, nft.price);

        // Remove the NFT from the listings
        delete listedNfts[_tokenId];
    }

    function cancelNFT(uint256 _tokenId) external ownerOfToken(_tokenId) {
        NFT storage nft = listedNfts[_tokenId];
        require(!nft.sold, "NFT already sold");

        // Transfer the NFT back to the owner
        nftContract.safeTransferFrom(address(this), nft.owner, _tokenId);

        emit NFTCanceled(_tokenId, nft.owner);

        // Remove the NFT from the listings
        delete listedNfts[_tokenId];
    }

    function getListedNFT(uint256 _tokenId) external view returns (NFT memory) {
        return listedNfts[_tokenId];
    }
}
