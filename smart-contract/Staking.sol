// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MasterChef is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20  for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;      
        uint256 rewardDebt; // userRewardPerTokenPaid
        uint256 rewardLockedUp; // rewards
        uint256 timestamp; //stake time
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;
        uint256 duration; // total lock period in seconds
        uint256 apy;  // apy in basis point
        uint256 lastRewardTime;  // Last block time that reward distribution occurs.
        uint256 accTokenPerShare;   // Accumulated reward per share, rewardPerTokenStored
        uint256 totalSupply; // total supply in this pool
    }

    // The Reward TOKEN!
    IERC20 public rewardToken;
    
    // rewards durations
    uint256 public rewardDuration = 365 days;
    
    // Info of each pool.
    PoolInfo[] public poolInfo;

    // mapping of stakeholder address by pool id
    mapping(uint256 => address[]) public stakeHolders;

    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

    // Total locked up rewards
    uint256 public totalLockedUpRewards;

    uint256 public totalClaimedRewards;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount, uint256 indexed timestamp);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount, uint256 indexed timestamp);
    event Harvest(address indexed user, uint256 amount, uint256 indexed timestamp);

    constructor(
        address _rewardToken
    )  {
        rewardToken = IERC20(_rewardToken);
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    function stakeHoldersLength(uint256 _pid) external view returns (uint256) {
        return stakeHolders[_pid].length;
    }

    function initializePools(IERC20 _lptoken1, IERC20 _lptoken2) external onlyOwner {
        add(_lptoken1, 86400*30, 100, true);
        add(_lptoken1, 86400*30*3, 400, true);
        add(_lptoken1, 86400*30*6, 800, true);
        add(_lptoken1, 86400*30*9, 1200, true);
        add(_lptoken1, 86400*30*12, 1800, true);

        add(_lptoken2, 86400*30, 100, true);
        add(_lptoken2, 86400*30*3, 400, true);
        add(_lptoken2, 86400*30*6, 800, true);
        add(_lptoken2, 86400*30*9, 1200, true);
        add(_lptoken2, 86400*30*12, 1800, true);
        
    }

    function add(IERC20 _lptoken, uint256 _duration, uint256 _apy, bool _withUpdate) public onlyOwner {
        
        if (_withUpdate) {
            massUpdatePools();
        }
        poolInfo.push(PoolInfo({
        lpToken: _lptoken,
        duration: _duration,
        apy: _apy,
        lastRewardTime: block.timestamp,
        accTokenPerShare: 0,
        totalSupply:0
        }));
    }

    function set(uint256 _pid, uint256 _duration, uint256 _apy, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        poolInfo[_pid].duration = _duration;
        poolInfo[_pid].apy = _apy;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public pure returns (uint256) {
        return _to.sub(_from);
    }

    // View function to see pending 888 on frontend.
    function pendingToken(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accTokenPerShare = pool.accTokenPerShare;
        uint256 lpSupply = pool.totalSupply;
        if (block.timestamp > pool.lastRewardTime && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardTime, block.timestamp);
            // calculate Rewards (totalSupply x apy / 10000) / 1year
            uint256 tokenReward = lpSupply.mul(pool.apy).mul(multiplier).div(10000).div(rewardDuration);
            accTokenPerShare = accTokenPerShare.add(tokenReward.mul(1e18).div(lpSupply)); // tokenReward.mul(1e12).div(lpSupply)
        }
        uint256 pending = user.amount.mul(accTokenPerShare).div(1e18).sub(user.rewardDebt);
        return pending.add(user.rewardLockedUp);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.timestamp <= pool.lastRewardTime) {
            return;
        }
        uint256 lpSupply = pool.totalSupply;
        if (lpSupply == 0) {
            pool.lastRewardTime = block.timestamp;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardTime, block.timestamp);
        uint256 tokenReward = lpSupply.mul(pool.apy).mul(multiplier).div(10000).div(rewardDuration);
        
        pool.accTokenPerShare = pool.accTokenPerShare.add(tokenReward.mul(1e18).div(lpSupply));
        pool.lastRewardTime = block.timestamp;
    }


    // Deposit LP tokens to MasterChef for 888 allocation.
    function deposit(uint256 _pid, uint256 _amount) public nonReentrant { 
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        LockupPendingToken(_pid);
        if (_amount > 0) {
            if( user.amount == 0 ) {
                addStakeholder(msg.sender, _pid);
                user.timestamp = block.timestamp;
            }
            pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            user.amount = user.amount.add(_amount);
            pool.totalSupply = pool.totalSupply.add(_amount);
            emit Deposit(msg.sender, _pid, user.amount, block.timestamp);
        }
        user.rewardDebt = user.amount.mul(pool.accTokenPerShare).div(1e18);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) internal nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        require(block.timestamp >= user.timestamp.add(pool.duration), "Stake period is not expired..");
        updatePool(_pid);
        LockupPendingToken(_pid);
        if (_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.totalSupply = pool.totalSupply.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        if ( user.amount == 0 ) {
            removeStakeholder(msg.sender, _pid);
            user.timestamp = 0;
        }

        user.rewardDebt = user.amount.mul(pool.accTokenPerShare).div(1e18);
        emit Withdraw(msg.sender, _pid, _amount, block.timestamp);
    }

    // Pay or lockup pending 888s.
    function LockupPendingToken(uint256 _pid) internal {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 pending = user.amount.mul(pool.accTokenPerShare).div(1e18).sub(user.rewardDebt); 

        user.rewardLockedUp = user.rewardLockedUp.add(pending);
        totalLockedUpRewards = totalLockedUpRewards.add(pending);
        
    }

    function getRewards(uint256 _pid) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        LockupPendingToken(_pid);

        uint256 pending = user.amount.mul(pool.accTokenPerShare).div(1e18).sub(user.rewardDebt);

        if (pending > 0 || user.rewardLockedUp > 0) {
            uint256 totalRewards = pending.add(user.rewardLockedUp);
            totalClaimedRewards = totalClaimedRewards.add(totalRewards);    
            // reset lockup
            totalLockedUpRewards = totalLockedUpRewards.sub(user.rewardLockedUp);
            user.rewardLockedUp = 0;
            user.rewardDebt = user.amount.mul(pool.accTokenPerShare).div(1e18);
            // send rewards
            rewardToken.safeTransferFrom(owner(), msg.sender, totalRewards);
            
            emit Harvest(msg.sender, totalRewards, block.timestamp);
        }
    }

    function exit(uint256 _pid, uint256 _amount) external {
        getRewards(_pid);
        withdraw(_pid, _amount);
    }

    function remainingRewardTokens() external view returns (uint256) {
        return Math.min(rewardToken.balanceOf(owner()), rewardToken.allowance(owner(), address(this)));
    }

    function withdrawAllowed(uint256 _pid, address _user) public view returns (bool) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];

        return block.timestamp >= user.timestamp.add(pool.duration);
    }

    function isStakeholder(address _address, uint256 _pid)
        internal
        view
        returns(bool, uint256)
    {
        for (uint256 s = 0; s < stakeHolders[_pid].length; s += 1){
            if (_address == stakeHolders[_pid][s]) return (true, s);
        }
        return (false, 0);
    }

   
    function addStakeholder(address _stakeholder, uint256 _pid)
        internal
    {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder, _pid);
        if(!_isStakeholder) stakeHolders[_pid].push(_stakeholder);
    }

    
    function removeStakeholder(address _stakeholder, uint)
        internal
    {
        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder, _pid);
        if(_isStakeholder){
            stakeHolders[_pid][s] = stakeHolders[_pid][stakeHolders[_pid].length - 1];
            stakeHolders[_pid].pop();
        } 
    }
 
}