// Proxy.sol
pragma solidity ^0.8.0;

contract TwitterProxy {
    address public implementation;
    address public contractAddress;
    address public immutable i_owner;
    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;
    mapping(address => string[]) public s_addressToTweets;
    event Tweet(address indexed _from, string indexed _tweetUrl);
    uint256 public constant TOTAL_SUPPLY = 1000;
    string public s_name = "TwitterToken";
    string public s_symbol = "TWT";
    uint256 public s_decimals = 8;
    mapping(address => uint256) public s_balanceOf;
    mapping(address => mapping(address => uint256)) public s_allowances;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(address _implementation) {
        i_owner = msg.sender;
        contractAddress = _implementation;
        implementation = _implementation;
    }

    function updateImplementation(address _newImplementation) public {
        require(msg.sender == i_owner, "Only owner can update implementation");
        implementation = _newImplementation;
    }

    // Proxy fallback function using delegatecall
    fallback() external payable {
        address impl = implementation;
        require(impl != address(0), "Implementation address is zero ");

        assembly {
            let ptr := mload(0x40)
            // (1) copy incoming call data
            calldatacopy(ptr, 0, calldatasize())
            // (2) forward call to logic contract
            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
            // (3) retrieve return data
            let size := returndatasize()
            returndatacopy(ptr, 0, size)
            // (4) forward return data back to caller
            switch result
            case 0 {
                revert(ptr, size)
            }
            default {
                return(ptr, size)
            }
        }
    }

    receive() external payable {
        address impl = implementation;
        require(impl != address(0), "Implementation address is zero");

        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)

            switch result
            case 0 {
                revert(ptr, size)
            }
            default {
                return(ptr, size)
            }
        }
    }
}
