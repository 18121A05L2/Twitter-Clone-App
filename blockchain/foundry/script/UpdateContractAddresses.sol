// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {stdJson} from "forge-std/StdJson.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {console} from "forge-std/console.sol";

contract UpdateContractAddresses is Script {
    using stdJson for string;

    string frontEndContractAddresses = "../../frontend/utils/Blockchain/foundry/contractAddresses.json";
    string TwitterAbiFileLoc = "../../frontend/utils/Blockchain/foundry/TwitterAbi.json";
    string TwitterNftAbiFileLoc = "../../frontend/utils/Blockchain/foundry/TwitterNftAbi.json";

    function run() external {
        address twitterProxy = DevOpsTools.get_most_recent_deployment("TwitterProxy", block.chainid);
        address twitterV2 = DevOpsTools.get_most_recent_deployment("TwitterV2", block.chainid);
        address twitter = DevOpsTools.get_most_recent_deployment("Twitter", block.chainid);
        console.log(block.chainid);
        string memory chainName = block.chainid == 1
            ? "mainnet"
            : block.chainid == 11155111 ? "sepolia" : block.chainid == 31337 ? "localhost" : "unknown";

        // TODO : need to append to the existing json file
        string memory existingContractAddresses = vm.readFile(frontEndContractAddresses);

        // Parse the JSON
        bytes memory jsonBytes = bytes(existingContractAddresses);
        if (jsonBytes.length == 0) {
            // If the file is empty, initialize it
            existingContractAddresses = "{}";
        }

        string memory obj1 = "some key"; // root json
        string memory obj2 = "some other key"; // nested json { "Twitter": "0xc5a5c42992decbae36851359345fe25997f5c42d"}

        // TwitterProxy
        string memory tempString = Strings.toHexString(uint256(uint160(twitterProxy)), 20);
        string memory tempString2 = vm.serializeString(obj2, "TwitterProxy", tempString);
        vm.serializeString(obj1, chainName, tempString2);

        // Twitter
        string memory tempString3 = Strings.toHexString(uint256(uint160(twitter)), 20);
        string memory tempString4 = vm.serializeString(obj2, "Twitter", tempString3);
        vm.serializeString(obj1, chainName, tempString4);

        // TwitterV2
        string memory tempString5 = Strings.toHexString(uint256(uint160(twitterV2)), 20);
        string memory tempString6 = vm.serializeString(obj2, "TwitterV2", tempString5);
        string memory nestedJson3 = vm.serializeString(obj1, chainName, tempString6);

        // Write the updated JSON back to the file
        vm.writeFile(frontEndContractAddresses, nestedJson3);
    }
}
