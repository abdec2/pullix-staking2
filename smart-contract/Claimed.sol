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
    mapping(address => mapping(Stage => bool)) public IsClaimed;


    event Claimed(address indexed tokenAddress, address indexed user, uint256 amount, uint256 indexed timestamp);

    event Staked(address indexed tokenAddress, address indexed user, uint256 amount, uint256 indexed timestamp);

    constructor(address _stakingContract, address _token, bytes32 _root) Ownable(msg.sender) {
        stakingContract = _stakingContract;
        token = IERC20(_token);
        root = _root;

    }

    function allowStageRelease(Stage _stage) external onlyOwner {
        require(!stageStarted[_stage], "Stage Already Started..");
        stageStarted[_stage] = true;
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
        require(msg.sender != address(0), "CONTRACT: Caller is zero address");
        require(address(token) != address(0), "CONTRACT: Token is not set.");
        require(isValid(proof, keccak256(abi.encodePacked(msg.sender, _amount))), "Caller not whitelisted");

        uint256 stakeAmount = 0;
        if(!userInitialized[msg.sender]) {
           userInitialized[msg.sender]  = true;
           stakeAmount = _amount;
        } else {
            stakeAmount = userBalance[msg.sender];
            userBalance[msg.sender] = 0;
        }

        MasterChef(stakingContract).deposit(2, stakeAmount);
        emit Staked(address(token), msg.sender, stakeAmount, block.timestamp);

    }

    function Claim(uint256 _amount, bytes32[] memory proof) external nonReentrant {
        require(msg.sender != address(0), "CONTRACT: Caller is zero address");
        require(address(token) != address(0), "CONTRACT: Token is not set.");
        require(isValid(proof, keccak256(abi.encodePacked(msg.sender, _amount))), "Caller not whitelisted");

        if(!userInitialized[msg.sender]) {
           userInitialized[msg.sender]  = true;
           userBalance[msg.sender] = _amount;
        } 
        
        uint256 claimAmount = 0;
        if(stageStarted[Stage.STAGE_1] && !IsClaimed[msg.sender][Stage.STAGE_1]) {
            claimAmount = claimAmount + (_amount * 25) / 100;
            IsClaimed[msg.sender][Stage.STAGE_1] = true;
        }
        if(stageStarted[Stage.STAGE_2] && !IsClaimed[msg.sender][Stage.STAGE_2]) {
            claimAmount = claimAmount + (_amount * 25) / 100;
            IsClaimed[msg.sender][Stage.STAGE_2] = true;
        }
        if(stageStarted[Stage.STAGE_3] && !IsClaimed[msg.sender][Stage.STAGE_3]) {
            claimAmount = claimAmount + (_amount * 25) / 100;
            IsClaimed[msg.sender][Stage.STAGE_3] = true;
        }
        if(stageStarted[Stage.STAGE_4] && !IsClaimed[msg.sender][Stage.STAGE_4]) {
            claimAmount = claimAmount + (_amount * 25) / 100;
            IsClaimed[msg.sender][Stage.STAGE_4] = true;
        }

        require(claimAmount <=  userBalance[msg.sender], "Invalid Claim..");
        userBalance[msg.sender] = userBalance[msg.sender] - claimAmount;

        
        tokensClaimed[msg.sender] = tokensClaimed[msg.sender] + claimAmount;
        token.safeTransferFrom(owner(), msg.sender, claimAmount);

        emit Claimed(address(token), msg.sender, claimAmount, block.timestamp);
    }


}