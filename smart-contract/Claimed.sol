// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface MasterChef {
    function deposit(uint256 _pid, uint256 _amount) external;
}

contract PlxClaiming is Ownable, ReentrancyGuard {
    using SafeERC20  for IERC20;

    IERC20 private token;
    bytes32 public root;

    address public stakingContract;

    enum Stage { STAGE_1, STAGE_2, STAGE_3, STAGE_4}

    mapping(address => bool) public userInitialized;
    mapping(address => uint256) public userBalance;
    mapping(address => uint256) public tokensClaimed;

    mapping(Stage => bool) public stageStarted;


    event Claimed(address indexed tokenAddress, address indexed user, uint256 amount, uint256 indexed timestamp);

    constructor(address _stakingContract, address _token, bytes32 _root) Ownable(msg.sender) {
        stakingContract = _stakingContract;
        token = IERC20(_token);
        root = _root;

    }

    function isValid(bytes32[] memory proof, bytes32 leaf) public view returns (bool) {
       return MerkleProof.verify(proof, root, leaf);
    }

    function setRoot(bytes32 _root) external onlyOwner {
        root = _root;
    }

    function setStakingContract(address _stakingContract) external onlyOwner {
        stakingContract = _stakingContract;
    }

    function Stake(uint256 _amount, bytes32[] memory proof) external nonReentrant {

    }

    function Claim(uint256 _amount, bytes32[] memory proof) external nonReentrant {

    }


}