// SPDX-License-Identifier: AGPL 3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GlueToken is ERC20 {
    constructor() public ERC20("Monte Rosa Token", "GLUE") {
        _mint(msg.sender, 10**24); // 1 million tokens with 18 deecimal digits
    }
}
