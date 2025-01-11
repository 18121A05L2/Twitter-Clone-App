// SPDX-License-Identifier: MIT
// ERC20 Contract
pragma solidity ^0.8.0;

error TwitterToken_InefficientBalane();
error TwitterToken_NotEnoughAllowances();

contract TwitterToken {
    uint256 public constant TOTAL_SUPPLY = 1000;
    string public s_name = "TwitterToken";
    string public s_symbol = "TWT";
    uint256 public s_decimals = 8;
    mapping(address => uint256) public s_balanceOf;
    mapping(address => mapping(address => uint256)) public s_allowances;

    constructor() {
        s_balanceOf[msg.sender] = (TOTAL_SUPPLY * 10 ** s_decimals) / 2;
        s_balanceOf[address(this)] = (TOTAL_SUPPLY * 10 ** s_decimals) / 2;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function name() public view returns (string memory) {
        return s_name;
    }

    function symbol() public view returns (string memory) {
        return s_symbol;
    }

    function decimals() public view returns (uint256) {
        return s_decimals;
    }

    function totalSupply() public view returns (uint256) {
        return TOTAL_SUPPLY * 10 ** s_decimals;
    }

    function balanceOf() public view returns (uint256 balance) {
        return s_balanceOf[msg.sender];
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != address(0x0));
        // Check if the sender has enough
        require(s_balanceOf[_from] >= _value);
        // Check for overflows
        require(s_balanceOf[_to] + _value >= s_balanceOf[_to]);
        uint256 previousBalances = s_balanceOf[_from] + s_balanceOf[_to];
        s_balanceOf[_from] -= _value;
        s_balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        assert(s_balanceOf[_from] + s_balanceOf[_to] == previousBalances);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    // claiming approval
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        if (_value > s_allowances[_from][msg.sender]) {
            revert TwitterToken_NotEnoughAllowances();
        }
        s_allowances[_from][msg.sender] -= _value;
        s_balanceOf[_from] -= _value;
        s_balanceOf[_to] += _value;
        // _transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        require(s_balanceOf[msg.sender] >= _value, " User doesn't have enought tokens ");
        s_allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {}

    //----------------------------- End of ERC-20 Token implementation -----------------------------

    function approveTokensForNftContract(address _from, address _spender, uint256 _value) public {
        require(s_balanceOf[_from] >= _value, " User doesn't have enought tokens ");
        s_allowances[_from][_spender] = _value;
    }
}

// https://eips.ethereum.org/EIPS/eip-20#simple-summary

// https://ethereum.org/en/developers/docs/standards/tokens/erc-20/
