// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface MasterChef {
    function deposit(uint256 _pid, uint256 _amount) external;
}

contract PlxClaiming is Ownable, ReentrancyGuard {
    using SafeERC20  for IERC20;

    address public stakingContract;

    mapping(address => bool) public userInitialized;
    mapping(address => uint256) public userBalance;
    mapping(address => uint256) public tokenClaimed;

    constructor(address _stakingContract) Ownable(msg.sender) {
        stakingContract = _stakingContract;
    }

    function setStakingContract(address _stakingContract) external onlyOwner {
        stakingContract = _stakingContract;
    }

    function Stake(uint256 _amount) external nonReentrant {

    }

    function Claim(uint256 _amount) external nonReentrant {

    }


}