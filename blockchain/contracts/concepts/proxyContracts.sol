pragma solidity ^0.8;

contract Proxy {
    address target;

    function setTarget(address _target) external {
        // you can change the value of `target` variable in storage
        // without chanding the `Proxy` contract bytecode
        target = _target;
    }

    fallback(bytes calldata) external returns (bytes memory) {
        (bool success, bytes memory returnedData) = target.delegatecall(
            msg.data
        );
        require(success);
        return returnedData;
    }
}
