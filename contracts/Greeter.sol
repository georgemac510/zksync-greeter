//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.11;

contract Greeter {
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}

// zkSync address: 0x4DF2DC35a8C7541292Aa8c64F21792516fdD28B9
// https://zksync2-testnet.zkscan.io/address/0x4DF2DC35a8C7541292Aa8c64F21792516fdD28B9/transactions