// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./FundMe.sol";
import "./TwitterToken.sol";
import "./TwitterNfts.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {ERC1967Utils} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error Twitter_NotOwner();

/**
 * @title integrating twitter with blockchain
 * @author Lakshmi Sanikommu
 * @notice This is Implementation Contract
 */
contract Twitter is TwitterToken, ERC165, Initializable, OwnableUpgradeable, UUPSUpgradeable {
    using FundMe for uint256;

    address public i_owner;
    AggregatorV3Interface internal s_priceFeed;
    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;
    mapping(address => string[]) public s_addressToTweets;

    event Tweet(address indexed _from, string _tweetUrl);

    mapping(address => string) public profiles;
    TwitterNfts public nftContract;

    // modifier onlyOwner() {
    //     if (msg.sender != i_owner) revert Twitter_NotOwner();
    //     _;
    // }

    // TODO : need to check Gas const for this constructor
    constructor() {
        _disableInitializers();
    }

    // constructor(address priceFeedAddress) payable {
    //     require(msg.value > 0, "Must send ETH to deploy");
    //     i_owner = msg.sender;
    //     s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    //     contractAddress = address(this);
    // }

    function __Twitter_init(address initialOwner, address priceFeedAddress) public payable initializer {
        __Ownable_init(initialOwner);
        __TwitterToken__init();
        require(msg.value > 0 && msg.value < 0.11 ether, "Must send ETH to deploy");
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function setNftContractAddress(address _nftContractAddress) public onlyOwner {
        nftContract = TwitterNfts(_nftContractAddress);
    }

    function tweet(string memory tweetUrl) public payable {
        // U need to pay 1 Twitter token for Tweet
        require(uint256(msg.value) >= uint256(1 * 10 ** s_decimals), "need 1 TWT token");
        require(s_balanceOf[msg.sender] >= msg.value, " Not enough TWT token balance");
        s_balanceOf[msg.sender] -= msg.value;
        s_balanceOf[address(this)] += msg.value;
        s_addressToTweets[msg.sender].push(tweetUrl);
        emit Tweet(msg.sender, tweetUrl);
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function retriveTweets(address _address) public view returns (string[] memory) {
        return s_addressToTweets[_address];
    }

    function withdraw() public payable onlyOwner {
        // payable(msg.sender).transfer(address(this).balance);
        (bool success,) = payable(msg.sender).call{value: address(this).balance}("");
        require(success, " withdraw failed ");
    }

    function fund() public payable {
        uint256 MIN_DONATE_AMT = 100 * 10 ** 18;
        require(msg.value.getEthAmountInUsd(s_priceFeed) > MIN_DONATE_AMT, " Minimum donation amount is 100 dollars");
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function getAllFunders() public view returns (address[] memory) {
        return s_funders;
    }

    function faucet() public payable {
        require(s_balanceOf[address(this)] >= 10 * 10 ** s_decimals, " faucet failed ");
        s_balanceOf[msg.sender] += 10 * 10 ** s_decimals;
        s_balanceOf[address(this)] -= 10 * 10 ** s_decimals;
    }

    function freeEth(uint256 amount) public payable {
        require(address(this).balance >= amount, " Contract not have 0.01 ETH");
        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, " Failed to send 0.01 ETH");
    }

    function setProfile(string memory _tokenUri, uint256 _id) public returns (bool) {
        require(nftContract.ownerOf(_id) == msg.sender, "Must own the nft");
        profiles[msg.sender] = _tokenUri;
        return true;
    }

    function setProfileAtMint(string memory _tokenUri, address walletAddress) public returns (bool) {
        profiles[walletAddress] = _tokenUri;
        return true;
    }

    function getProfile(address _address) public view returns (string memory) {
        return profiles[_address];
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC165) returns (bool) {
        return interfaceId == type(IERC20).interfaceId || super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function getVersion() external pure virtual returns (uint256) {
        return 1;
    }

    function getImplementation() external view returns (address) {
        return ERC1967Utils.getImplementation();
    }

    // A fallback function to accept ETH
    receive() external payable {}
}
