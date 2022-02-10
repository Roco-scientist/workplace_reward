// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardsToken is ERC20 {
    constructor(uint256 supply) public ERC20("Rewards Token", "YW") {
        _mint(msg.sender, supply); 
    }

    function decimals() public view override returns (uint8) {
        return 2;
    }
}
