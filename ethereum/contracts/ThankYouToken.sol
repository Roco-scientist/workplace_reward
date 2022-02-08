// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ThankYouToken is ERC20 {
    constructor(uint256 supply) public ERC20("Thank You Token", "TY") {
        _mint(msg.sender, supply); // 1 million tokens with 18 deecimal digits
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}