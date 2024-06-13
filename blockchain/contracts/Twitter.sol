// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./FundMe.sol";
import "./TwitterToken.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error Twitter_NotOwner();

/**
 * @title integrating twitter clone with blockchain
 * @author lucky
 * @notice This a smaple testing project
 */

contract Twitter is TwitterToken {
    address public implementation;
    address public contractAddress;
    TwitterToken public TwitterTokenInstance;
    using FundMe for uint256;
    address public immutable i_owner;
    // uint256 public constant PER_TWEET = 10 * 10 ** 18; // per tweet 10 dollars
    AggregatorV3Interface internal s_priceFeed;
    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;
    mapping(address => string[]) public s_addressToTweets;
    event Tweet(address indexed _from, string indexed _tweetUrl);

    // string[] public s_msgStore;

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert Twitter_NotOwner();
        _;
    }

    constructor(address priceFeedAddress) payable {
        require(msg.value > 0, "Must send ETH to deploy");
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
        TwitterTokenInstance = new TwitterToken();
        contractAddress = address(this);
    }

    function tweet(string memory tweetUrl) public payable {
        require(
            uint256(msg.value) >= uint256(1 * 10 ** s_decimals),
            " U need to pay 1 Twitter token for Tweet"
        );
        require(
            s_balanceOf[msg.sender] >= msg.value,
            " Not enough Twitter token balance"
        );
        s_balanceOf[msg.sender] -= msg.value;
        s_balanceOf[contractAddress] += msg.value;
        s_addressToTweets[msg.sender].push(tweetUrl);
        emit Tweet(msg.sender, tweetUrl);
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function retriveTweets(
        address _address
    ) public view returns (string[] memory) {
        return s_addressToTweets[_address];
    }

    function withdraw() public payable onlyOwner {
        // payable(msg.sender).transfer(address(this).balance);
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, " withdraw failed ");
    }

    function fund() public payable {
        uint256 MIN_DONATE_AMT = 100 * 10 ** 18;
        require(
            msg.value.getEthAmountInUsd(s_priceFeed) > MIN_DONATE_AMT,
            " Minimum donation amount is 100 dollars"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function getAllFunders() public view returns (address[] memory) {
        return s_funders;
    }

    function getTotalSupply() public pure returns (uint256 location) {
        return TOTAL_SUPPLY;
    }

    function faucet() public payable {
        require(
            s_balanceOf[contractAddress] >= 10 * 10 ** s_decimals,
            " faucet failed "
        );
        s_balanceOf[msg.sender] += 10 * 10 ** s_decimals;
        s_balanceOf[contractAddress] -= 10 * 10 ** s_decimals;
    }

    function freeEth(uint256 amount) public payable {
        require(
            contractAddress.balance >= amount,
            " Contract does not have the required balance of 0.01 ETH"
        );
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, " Failed to send 0.01 ETH");
    }

    function destroy() public onlyOwner {
        selfdestruct(payable(i_owner));
    }

    // A fallback function to accept ETH
    receive() external payable {}
}
