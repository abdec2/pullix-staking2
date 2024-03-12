// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenContract  is ERC20 {
    uint8 public decimal;
    constructor(
        string memory name,
        string memory symbol,
        uint256 initial_supply, 
        uint8 _decimal
    ) ERC20(name, symbol) {
        _mint(msg.sender, initial_supply * 10 ** _decimal);
        decimal = _decimal;
    }

    function decimals() public view virtual override returns (uint8) {
        return decimal;
    }
}